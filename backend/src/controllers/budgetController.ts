import { Request, Response } from "express";
import db from "../config/database";
import { RowDataPacket } from "mysql2";

// Récupérer tous les budgets de l'utilisateur
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    console.log(`📊 [BUDGETS] Requête GET /budgets`);
    console.log(`   User ID: ${userId || "❌ Non trouvé"}`);

    if (!userId) {
      console.warn(`⚠️  [BUDGETS] Utilisateur non authentifié`);
      return res.status(401).json({ message: "Non autorisé" });
    }

    console.log(`🔍 [BUDGETS] Recherche des budgets pour l'utilisateur ${userId}...`);
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT
        b.id,
        b.month,
        b.limit_amount AS amount,
        IFNULL(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS spent
      FROM budgets b
      LEFT JOIN transactions t ON t.user_id = b.user_id
        AND t.type = 'expense'
        AND DATE_FORMAT(t.date, '%Y-%m') = b.month
      WHERE b.user_id = ?
      GROUP BY b.id, b.month, b.limit_amount
      ORDER BY b.month DESC`,
      [userId]
    );

    console.log(`✅ [BUDGETS] ${rows.length} budget(s) trouvé(s)`);
    res.json(rows.map((row: any) => ({
      ...row,
      amount: Number(row.amount || 0),
      spent: Number(row.spent || 0),
      budget_limit: Number(row.amount || 0),
    })));
  } catch (error: any) {
    console.error(`❌ [BUDGETS] Erreur:`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Stack: ${error.stack}`);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Ajouter ou mettre à jour un budget
export const saveBudget = async (req: Request, res: Response) => {
  try {
    console.log(`\n💰 [BUDGET POST] ===== DÉBUT =====`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    console.log(`   Body reçu: ${JSON.stringify(req.body)}`);

    const userId = (req as any).user?.id;
    console.log(`   User ID: ${userId || "❌ Non trouvé"}`);

    if (!userId) {
      console.warn(`⚠️  [BUDGET POST] Utilisateur non authentifié`);
      return res.status(401).json({ message: "Non autorisé" });
    }

    const { month, amount } = req.body;
    console.log(`   Paramètres extraits:`, { month, amount });

    if (
      typeof month !== "string" ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      console.warn(`⚠️  [BUDGET POST] Champs manquants`);
      return res.status(400).json({
        message: "month (YYYY-MM) et un montant positif sont requis",
      });
    }

    console.log(`🔍 Vérification budget existant...`);
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM budgets WHERE user_id = ? AND month = ? ORDER BY id LIMIT 1",
      [userId, month]
    );

    console.log(`   Budgets existants trouvés: ${rows.length}`);

    const numericAmount = Number(amount);

    if (rows.length > 0) {
      console.log(`✏️  Mise à jour du budget existant...`);
      await db.query(
        "UPDATE budgets SET limit_amount = ? WHERE id = ?",
        [numericAmount, rows[0].id]
      );
      console.log(`✅ Budget mis à jour`);
      res.json({ message: "Budget mis à jour" });
    } else {
      console.log(`➕ Création nouveau budget...`);
      await db.query(
        "INSERT INTO budgets (user_id, month, limit_amount) VALUES (?, ?, ?)",
        [userId, month, numericAmount]
      );
      console.log(`✅ Budget créé`);
      res.json({ message: "Budget ajouté" });
    }
    console.log(`💰 [BUDGET POST] ===== FIN (SUCCÈS) =====\n`);
  } catch (error: any) {
    console.error(`\n❌ [BUDGET POST] ===== ERREUR =====`);
    console.error(`   Type: ${error.constructor.name}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Errno: ${error.errno}`);
    console.error(`   SQL: ${error.sql}`);
    console.error(`   Stack:\n${error.stack}`);
    console.error(`❌ [BUDGET POST] ===== FIN (ERREUR) =====\n`);

    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
      code: error.code,
      sql: error.sql,
    });
  }
};

// Récupérer dépenses par catégorie pour un mois
export const getMonthlyBudget = async (req: Request, res: Response) => {
  try {
    const { month } = req.params;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Non autorisé" });

    const [budgetRows] = await db.query<RowDataPacket[]>(
      "SELECT COALESCE(limit_amount, 0) AS amount FROM budgets WHERE user_id = ? AND month = ? LIMIT 1",
      [userId, month]
    );
    const budget = Number(budgetRows[0]?.amount || 0);

    const [expenseRows] = await db.query<RowDataPacket[]>(
      "SELECT SUM(amount) AS total FROM transactions WHERE user_id = ? AND type = 'expense' AND DATE_FORMAT(date, '%Y-%m') = ?",
      [userId, month]
    );
    const totalExpenses = Number(expenseRows[0]?.total || 0);

    const [categoryRows] = await db.query<RowDataPacket[]>(
      `SELECT
        c.id,
        c.name AS name,
        c.color AS color,
        COUNT(t.id) AS count,
        IFNULL(SUM(t.amount), 0) AS total
      FROM categories c
      LEFT JOIN transactions t ON t.category_id = c.id AND t.user_id = ? AND t.type = 'expense' AND DATE_FORMAT(t.date, '%Y-%m') = ?
      WHERE c.user_id = ?
      GROUP BY c.id, c.name, c.color`,
      [userId, month, userId]
    );

    res.json({
      budget,
      expenses: totalExpenses,
      remaining: budget - totalExpenses,
      percentage: budget ? (totalExpenses / budget) * 100 : 0,
      categories: categoryRows,
    });
  } catch (error) {
    console.error("Erreur getMonthlyBudget :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Historique des budgets (6 derniers mois)
export const getBudgetHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ message: "Non autorisé" });
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT
        month,
        limit_amount AS budget,
        (
          SELECT IFNULL(SUM(amount), 0)
          FROM transactions
          WHERE user_id = ? AND type = 'expense' AND DATE_FORMAT(date, '%Y-%m') = budgets.month
        ) AS expenses
      FROM budgets
      WHERE user_id = ?
      ORDER BY month DESC
      LIMIT 6`,
      [userId, userId]
    );
    res.json(rows.map((row: any) => ({
      ...row,
      budget: Number(row.budget || 0),
      expenses: Number(row.expenses || 0),
    })));
  } catch (error) {
    console.error("Erreur getBudgetHistory :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
