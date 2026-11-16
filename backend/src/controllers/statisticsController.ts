// src/controllers/statisticsController.ts
import { Request, Response } from "express";
import db from "../config/database";
import { RowDataPacket } from "mysql2";

// 🔹 1. Récupérer les statistiques mensuelles
export const getMonthlyStats = async (req: Request, res: Response) => {
  const monthParam = req.params.month as string | string[];
  const month = Array.isArray(monthParam) ? monthParam[0] : monthParam;
  const userId = (req as any).user?.id; // ✅ FIXED: Get from token, not URL

  console.log(`\n📊 [STATS MONTH] ===== DÉBUT =====`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  console.log(`   URL Params: { month: "${month}" }`);
  console.log(`   User: ${userId}`);
  console.log(`   Token: ${(req as any).user ? "✅ Present" : "❌ Missing"}`);

  if (!userId) {
    console.log(`   ❌ REJECTION: User ID not found in token`);
    console.log(`📊 [STATS MONTH] ===== FIN (ERROR) =====\n`);
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    console.log(`   🔍 Starting data fetch...`);

    // Parse month format "2026-01" into year and month
    const monthParts = month.split("-");
    const yearNum = parseInt(monthParts[0]);
    const monthNumInt = parseInt(monthParts[1]);
    console.log(`   📅 Parsed month: year=${yearNum}, month=${monthNumInt}`);

    // --- Budget du mois ---
    console.log(`   📝 Query 1: SELECT SUM(limit_amount) FROM budgets WHERE user_id = ? AND month = ?`);
    console.log(`      Params: [${userId}, "${month}"]`);
    const [budgetRows] = await db.query<RowDataPacket[]>(
      "SELECT IFNULL(SUM(limit_amount), 0) AS amount FROM budgets WHERE user_id = ? AND month = ?",
      [userId, month]
    );
    const budget = Number(budgetRows[0]?.amount || 0);
    console.log(`   ✅ Budget result: ${budget}`);

    // --- Dépenses du mois ---
    console.log(`   📝 Query 2: SUM expenses...`);
    console.log(`      Params: [${userId}, "expense", "${month}"]`);
    const [expenseRows] = await db.query<RowDataPacket[]>(
      "SELECT IFNULL(SUM(amount), 0) AS total FROM transactions WHERE user_id = ? AND type = 'expense' AND DATE_FORMAT(date, '%Y-%m') = ?",
      [userId, month]
    );
    const expenses = expenseRows[0]?.total || 0;
    console.log(`   ✅ Expenses result: ${expenses}`);

    // --- Revenus du mois ---
    console.log(`   📝 Query 3: SUM revenues...`);
    console.log(`      Params: [${userId}, "income", "${month}"]`);
    const [incomeRows] = await db.query<RowDataPacket[]>(
      "SELECT IFNULL(SUM(amount), 0) AS total FROM transactions WHERE user_id = ? AND type = 'income' AND DATE_FORMAT(date, '%Y-%m') = ?",
      [userId, month]
    );
    const revenues = incomeRows[0]?.total || 0;
    console.log(`   ✅ Revenues result: ${revenues}`);

    // --- Répartition par catégorie ---
    console.log(`   📝 Query 4: Categories with expenses...`);
    console.log(`      Params: [${userId}, "${month}", ${userId}]`);
    const [categoryRows] = await db.query<RowDataPacket[]>(
      `SELECT 
         c.id, 
         c.name, 
         c.color, 
         c.icon,
         c.budget,
         COUNT(t.id) AS count, 
         IFNULL(SUM(t.amount), 0) AS total 
       FROM categories c
       LEFT JOIN transactions t ON t.category_id = c.id 
         AND t.user_id = ? 
         AND t.type = 'expense' 
         AND DATE_FORMAT(t.date, '%Y-%m') = ?
       WHERE c.user_id = ?
       GROUP BY c.id, c.name, c.color, c.icon, c.budget
       ORDER BY total DESC`,
      [userId, month, userId]
    );
    console.log(`   ✅ Categories result: ${categoryRows.length} categories`);

    // --- Calculs globaux ---
    const remaining = budget - expenses;
    const percentage = budget > 0 ? (expenses / budget) * 100 : 0;

    console.log(`   ✨ Calculations:`);
    console.log(`      Remaining: ${remaining}`);
    console.log(`      Percentage: ${percentage.toFixed(2)}%`);

    const responseData = {
      month,
      budget: Number(budget),
      expenses: Number(expenses),
      revenues: Number(revenues),
      remaining: Number(remaining),
      percentage: Number(percentage),
      categories: categoryRows.map((c: any) => ({
        id: c.id,
        name: c.name,
        color: c.color,
        icon: c.icon,
        budget: Number(c.budget) || 0,
        count: Number(c.count),
        total: Number(c.total),
      })),
    };

    console.log(`   📤 Response payload prepared: ${JSON.stringify(responseData, null, 2)}`);
    console.log(`✅ [STATS MONTH] ===== FIN (SUCCESS) =====\n`);

    res.json(responseData);
  } catch (error: any) {
    console.error(`\n❌ [STATS MONTH ERROR]`);
    console.error(`   Type: ${error.constructor.name}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Errno: ${error.errno}`);
    console.error(`   SQL: ${error.sql}`);
    console.error(`   Stack: ${error.stack}`);
    console.error(`📊 [STATS MONTH] ===== FIN (ERROR) =====\n`);
    
    res.status(500).json({ 
      message: "Erreur lors de la récupération des statistiques mensuelles",
      error: error.message,
      code: error.code
    });
  }
};

// 🔹 2. Évolution journalière (LineChart)
export const getDailyStats = async (req: Request, res: Response) => {
  const { month } = req.params;
  const userId = (req as any).user?.id; // ✅ FIXED: Get from token, not URL

  console.log(`\n📈 [DAILY STATS] ===== DÉBUT =====`);
  console.log(`   User: ${userId}, Month: ${month}`);

  if (!userId) {
    console.log(`   ❌ REJECTION: User ID not found`);
    console.log(`📈 [DAILY STATS] ===== FIN (ERROR) =====\n`);
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    console.log(`   🔍 Fetching daily breakdown...`);

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
        DAY(date) AS day,
        DATE_FORMAT(date, '%Y-%m-%d') AS date,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS revenues
       FROM transactions
       WHERE user_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?
       GROUP BY DAY(date), DATE_FORMAT(date, '%Y-%m-%d')
       ORDER BY DAY(date) ASC`,
      [userId, month]
    );

    const formattedRows = rows.map((r: any) => ({
      day: Number(r.day),
      date: r.date,
      expenses: Number(r.expenses) || 0,
      revenues: Number(r.revenues) || 0,
    }));

    console.log(`   ✅ Retrieved: ${formattedRows.length} days`);
    console.log(`📈 [DAILY STATS] ===== FIN (SUCCESS) =====\n`);

    res.json(formattedRows);
  } catch (error: any) {
    console.error(`\n❌ [DAILY STATS ERROR]`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`📈 [DAILY STATS] ===== FIN (ERROR) =====\n`);
    
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques journalières" });
  }
};

// 🔹 3. Historique sur 6 mois (BarChart)
export const getHistoryStats = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id; // ✅ FIXED: Get from token, not URL

  console.log(`\n📊 [HISTORY STATS] ===== DÉBUT =====`);
  console.log(`   User: ${userId}`);

  if (!userId) {
    console.log(`   ❌ REJECTION: User ID not found`);
    console.log(`📊 [HISTORY STATS] ===== FIN (ERROR) =====\n`);
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    console.log(`   🔍 Fetching last 6 months of budgets...`);

    // Get last 6 months of monthly budgets
    const [budgetRows] = await db.query<RowDataPacket[]>(
      `SELECT month, limit_amount AS budget
       FROM budgets
       WHERE user_id = ?
       ORDER BY month DESC
       LIMIT 6`,
      [userId]
    );

    console.log(`   ✅ Found ${budgetRows.length} budget records`);

    // For each budget month, get corresponding transactions
    const historyData = await Promise.all(
      budgetRows.map(async (budgetRow: any) => {
        const monthStr = budgetRow.month; // Format: "2026-01"
        
        console.log(`   📅 Processing month: ${monthStr}`);

        // Expenses for this month
        const [expenseData] = await db.query<RowDataPacket[]>(
          `SELECT IFNULL(SUM(amount), 0) AS total
           FROM transactions
           WHERE user_id = ? AND type = 'expense' AND DATE_FORMAT(date, '%Y-%m') = ?`,
          [userId, monthStr]
        );

        // Revenues for this month
        const [revenueData] = await db.query<RowDataPacket[]>(
          `SELECT IFNULL(SUM(amount), 0) AS total
           FROM transactions
           WHERE user_id = ? AND type = 'income' AND DATE_FORMAT(date, '%Y-%m') = ?`,
          [userId, monthStr]
        );

        return {
          month: monthStr,
          budget: Number(budgetRow.budget) || 0,
          expenses: Number(expenseData[0]?.total) || 0,
          revenues: Number(revenueData[0]?.total) || 0,
        };
      })
    );

    // Reverse to get chronological order
    const formattedRows = historyData.reverse();

    console.log(`   ✅ History data prepared: ${formattedRows.length} months`);
    console.log(`📊 [HISTORY STATS] ===== FIN (SUCCESS) =====\n`);

    res.json(formattedRows);
  } catch (error: any) {
    console.error(`\n❌ [HISTORY STATS ERROR]`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   SQL: ${error.sql}`);
    console.error(`📊 [HISTORY STATS] ===== FIN (ERROR) =====\n`);
    
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique" });
  }
};
