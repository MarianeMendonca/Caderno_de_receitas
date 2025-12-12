// index.tsx
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllRecipes, StoredRecipe } from "./storage";

const ORANGE = "#ff7a00";
const WHITE = "#ffffff";
const LIGHT_GRAY = "#f6f6f8";
const SHADOW = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: {
    elevation: 6,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },
  container: { flex: 1, backgroundColor: WHITE, paddingHorizontal: 20, paddingTop: 18 },
  header: { alignItems: "center", marginBottom: 18 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: ORANGE },
  headerSubtitle: { marginTop: 4, fontSize: 14, color: "#666" },

  featureCard: {
    flexDirection: "row",
    backgroundColor: LIGHT_GRAY,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginBottom: 18,
    ...SHADOW,
  },
  featureLeft: { width: 56, height: 56, borderRadius: 12, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", marginRight: 12 },
  featureEmoji: { fontSize: 26 },
  featureBody: { flex: 1 },
  featureLabel: { fontSize: 12, color: "#333", fontWeight: "500", marginBottom: 2 },
  featureTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  featureDesc: { marginTop: 4, fontSize: 12, color: "#555" },
  featureBadge: { backgroundColor: WHITE, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#eee" },
  badgeText: { fontSize: 12, fontWeight: "700", color: ORANGE },

  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, justifyContent: "space-between" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  seeAll: { paddingHorizontal: 8, paddingVertical: 4 },
  seeAllText: { color: ORANGE, fontWeight: "700" },

  list: { paddingBottom: 120 },

  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    ...SHADOW,
  },
  recipeLeft: { width: 52, height: 52, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12, backgroundColor: LIGHT_GRAY },
  recipeEmoji: { fontSize: 22 },
  recipeBody: { flex: 1 },
  recipeTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  recipeMeta: { marginTop: 6, fontSize: 12, color: "#666" },
  recipeRight: { marginLeft: 8 },
  goBtn: { backgroundColor: ORANGE, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  goBtnText: { color: WHITE, fontWeight: "700" },

  emptyText: { textAlign: "center", marginTop: 24, color: "#666" },

  fab: { position: "absolute", right: 22, bottom: 28, width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: ORANGE, ...SHADOW },
  fabText: { color: WHITE, fontSize: 32, lineHeight: 34, fontWeight: "800" },

  // Modal styles
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 20 },
  modalCard: { backgroundColor: WHITE, borderRadius: 12, padding: 16, maxHeight: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: ORANGE, marginBottom: 8 },
  modalMeta: { fontSize: 13, color: "#444", marginBottom: 12 },
  modalSectionTitle: { fontWeight: "700", marginTop: 8, marginBottom: 6 },
  modalText: { color: "#333", fontSize: 14, lineHeight: 20 },
  modalFooter: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  modalBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  modalBtnClose: { backgroundColor: "#eee" },
  modalBtnCloseText: { color: "#333", fontWeight: "700" },
});

const Index: React.FC = () => {
  const navigation = useNavigation<any>();
  const [recipes, setRecipes] = useState<StoredRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // modal state
  const [selected, setSelected] = useState<StoredRecipe | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    try {
      const stored = await getAllRecipes();
      setRecipes(stored);
    } catch (err) {
      console.error("Index.load error:", err);
      Alert.alert("Erro", "Não foi possível carregar as receitas.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  function openRecipe(item: StoredRecipe) {
    setSelected(item);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    // limpar seleção só para garantir
    setTimeout(() => setSelected(null), 200);
  }

  const renderRecipe = ({ item }: { item: StoredRecipe }) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeLeft}>
        <Text style={styles.recipeEmoji}>🥣</Text>
      </View>
      <View style={styles.recipeBody}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeMeta}>
          {item.time ? `⏱ ${item.time}` : ""} {item.difficulty ? `· ${item.difficulty}` : ""}
        </Text>
      </View>
      <View style={styles.recipeRight}>
        <TouchableOpacity style={styles.goBtn} onPress={() => openRecipe(item)}>
          <Text style={styles.goBtnText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Caderno de Receitas</Text>
          <Text style={styles.headerSubtitle}>Inspire-se. Cozinhe feliz.</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.featureCard} onPress={() => navigation?.navigate?.("AddRecipe")}>
          <View style={styles.featureLeft}>
            <Text style={styles.featureEmoji}>🍰</Text>
          </View>
          <View style={styles.featureBody}>
            <Text style={styles.featureLabel}>Receita em Destaque</Text>
            <Text style={styles.featureTitle}>Cheesecake de Morango</Text>
            <Text style={styles.featureDesc}>Cremoso, rápido e perfeito para sobremesas especiais.</Text>
          </View>
          <View style={styles.featureBadge}>
            <Text style={styles.badgeText}>Hoje</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Receitas Antigas</Text>
          <TouchableOpacity
            style={styles.seeAll}
            onPress={() => {
              if (!recipes.length) {
                Alert.alert("Sem receitas", "Ainda não há receitas salvas.");
                return;
              }
              Alert.alert("Receitas salvas", `Você tem ${recipes.length} receita(s) salvas.`);
            }}
          >
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" />
        ) : recipes.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma receita salva ainda. Use o botão + para adicionar.</Text>
        ) : (
          <FlatList data={recipes} keyExtractor={(i) => i.id} renderItem={renderRecipe} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
        )}

        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => navigation?.navigate?.("AddRecipe")}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>

        {/* Modal de detalhe */}
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <ScrollView>
                <Text style={styles.modalTitle}>{selected?.title}</Text>
                <Text style={styles.modalMeta}>
                  {selected?.time ? `⏱ ${selected.time}` : ""} {selected?.difficulty ? `· ${selected.difficulty}` : ""}
                </Text>

                <Text style={styles.modalSectionTitle}>Ingredientes</Text>
                <Text style={styles.modalText}>{selected?.ingredients || "(Não informado)"}</Text>

                <Text style={styles.modalSectionTitle}>Instruções</Text>
                <Text style={styles.modalText}>{selected?.instructions || "(Não informado)"}</Text>

                <View style={styles.modalFooter}>
                  <TouchableOpacity style={[styles.modalBtn, styles.modalBtnClose]} onPress={closeModal}>
                    <Text style={styles.modalBtnCloseText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Index;
