import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ColorPickerWrapperProps {
  value: string;
  onComplete: (color: any) => void;
}

// Palettes de couleurs organisées
const COLOR_PALETTES = {
  roses: ["#F9C0D3", "#FFB3BA", "#FF6B6B", "#E84A6A", "#D63447"],
  rouges: ["#FFD1E3", "#FFC3C3", "#FF9F9F", "#F77F88", "#E55039"],
  oranges: ["#FFB347", "#FF8C42", "#FF6B35", "#FF5722", "#E64A19"],
  orangeLight: ["#FFA500", "#FF8C00", "#FF7F50", "#FF6347", "#FF4500"],
  jaunes: ["#FFD700", "#FFC700", "#FFB700", "#FFA700", "#FF9F00"],
  jaunesLight: ["#FFE135", "#FFDF00", "#FFCD00", "#FFBB00", "#FFA500"],
  verts: ["#90EE90", "#7FE57F", "#66BB6A", "#4CAF50", "#388E3C"],
  vertsLight: ["#A8FFCC", "#5CFFB4", "#2EE88B", "#00C853", "#00B82E"],
  vertsVif: ["#76FF03", "#64DD17", "#51CF00", "#2E7D32", "#1B5E20"],
  bleus: ["#87CEEB", "#5BA3FF", "#2E7DD6", "#1976D2", "#1565C0"],
  bleusLight: ["#D5E8F7", "#A8D8FF", "#4FC3F7", "#00B0FF", "#0091EA"],
  bleusPale: ["#ADD8E6", "#4A90E2", "#357ABD", "#2E5C8A", "#1E3A5F"],
  violets: ["#DA70D6", "#BA55D3", "#9932CC", "#8B008B", "#6B0080"],
  violetsLight: ["#EE82EE", "#DDA0DD", "#DA70D6", "#BA55D3", "#9932CC"],
  violetsPale: ["#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#8E24AA"],
  gris: ["#A9A9A9", "#808080", "#696969", "#505050", "#2F4F4F"],
  grisLight: ["#D3D3D3", "#C0C0C0", "#BEBEBE", "#A9A9A9", "#808080"],
  cyans: ["#00FFFF", "#00E5FF", "#00B8D4", "#00897B", "#004D40"],
  cyansLight: ["#80DEEA", "#4DD0E1", "#26C6DA", "#00ACC1", "#0097A7"],
};

export const ColorPickerWrapper: React.FC<ColorPickerWrapperProps> = ({
  value,
  onComplete,
}) => {
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof COLOR_PALETTES>("roses");

  const allColors = Object.values(COLOR_PALETTES).flat();
  const currentPalette = COLOR_PALETTES[selectedPalette];

  return (
    <View style={styles.wrapper}>
      {/* Sélecteur de palette */}
      <View style={styles.paletteSelector}>
        {Object.keys(COLOR_PALETTES).map((paletteName) => (
          <TouchableOpacity
            key={paletteName}
            onPress={() => setSelectedPalette(paletteName as keyof typeof COLOR_PALETTES)}
            style={[
              styles.paletteTab,
              selectedPalette === paletteName && styles.paletteTabActive,
            ]}
          >
            <Text style={styles.paletteTabText}>
              {paletteName.charAt(0).toUpperCase() + paletteName.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grille de couleurs */}
      <View style={styles.colorGrid}>
        {currentPalette.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => {
              console.log("📌 Couleur sélectionnée:", color);
              onComplete({ hex: color });
            }}
            style={[
              styles.colorBox,
              { backgroundColor: color },
              value === color && styles.colorBoxSelected,
            ]}
          >
            {value === color && (
              <View style={styles.checkmark}>
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Affichage de la couleur sélectionnée */}
      <View style={styles.colorPreview}>
        <View style={[styles.colorPreviewBox, { backgroundColor: value }]} />
        <Text style={styles.colorText}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    pointerEvents: "auto",
  },
  paletteSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 4,
  },
  paletteTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginRight: 4,
    marginBottom: 4,
  },
  paletteTabActive: {
    backgroundColor: "#F78FA7",
  },
  paletteTabText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  colorBox: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
  },
  colorBoxSelected: {
    borderColor: "#000",
    borderWidth: 3,
  },
  checkmark: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    padding: 4,
  },
  colorPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  colorPreviewBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  colorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
});

