import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { TokenContext } from '../Context/Context';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../Api/todo';
import CustomAlert from '../components/UI/CustomAlert';
import TodoItem from '../components/TodoItem';

export default function TodoItemsScreen({ route, navigation }) {
  const { listeId, listeTitre } = route.params;
  const [token] = useContext(TokenContext);

  const [taches, setTaches] = useState([]);
  const [listeAafficher, setListeAafficher] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [nouvelleTache, setNouvelleTache] = useState('');
  const [creationEnCours, setCreationEnCours] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    navigation.setOptions({
      title: listeTitre || 'Liste des tâches'
    });
    chargerTaches();
  }, [listeId]);

  const chargerTaches = async () => {
    try {
      setChargement(true);
      const resultat = await getTodos(listeId, token);
      setTaches(resultat || []);
      setListeAafficher(resultat || []);
    } catch (err) {
      console.error("Erreur chargement tâches:", err);
      showAlert('Erreur', 'Impossible de charger les tâches');
    } finally {
      setChargement(false);
    }
  };

  const ajouterTache = async () => {
    if (nouvelleTache.trim() === '') {
      showAlert('Attention', 'Veuillez saisir une tâche');
      return;
    }

    try {
      setCreationEnCours(true);
      const tacheCreee = await createTodo(nouvelleTache, listeId, token);
      const nouvellesTaches = [...taches, tacheCreee];
      setTaches(nouvellesTaches);
      setListeAafficher(nouvellesTaches);
      setNouvelleTache('');
      showAlert('Succès', 'Tâche ajoutée avec succès');
    } catch (err) {
      console.error("Erreur création tâche:", err);
      showAlert('Erreur', 'Impossible de créer la tâche: ' + err.message);
    } finally {
      setCreationEnCours(false);
    }
  };

  // Fonction pour gérer le changement d'état (cocher/décocher)
  const handleToggleTask = async (taskId, newDoneValue) => {
    try {
      await updateTodo(taskId, newDoneValue, token);
      const nouvellesTaches = taches.map(tache =>
        tache.id === taskId ? { ...tache, done: newDoneValue } : tache
      );
      setTaches(nouvellesTaches);
      setListeAafficher(nouvellesTaches);
    } catch (err) {
      console.error("Erreur mise à jour tâche:", err);
      showAlert('Erreur', 'Impossible de mettre à jour la tâche: ' + err.message);
      chargerTaches();
    }
  };

  // Fonction pour supprimer une tâche
  const handleDeleteTask = async (taskId) => {
    try {
      const result = await deleteTodo(taskId, token);
      if (result > 0) {
        const nouvellesTaches = taches.filter(tache => tache.id !== taskId);
        setTaches(nouvellesTaches);
        setListeAafficher(nouvellesTaches);
        showAlert('Succès', 'Tâche supprimée avec succès');
      } else {
        showAlert('Erreur', 'La tâche n\'a pas pu être supprimée');
      }
    } catch (err) {
      console.error("Erreur suppression tâche:", err);
      showAlert('Erreur', 'Impossible de supprimer la tâche: ' + err.message);
    }
  };

  // Fonctions de filtrage
  const filter = (val) => {
    if (val === "TOUT") setListeAafficher(taches);
    else if (val === "EN COURS")
      setListeAafficher(taches.filter((item) => !item.done));
    else if (val === "RESOLUS")
      setListeAafficher(taches.filter((item) => item.done));
  };

  // Fonctions de gestion en masse
  const cocherTout = async () => {
    try {
      // Mettre à jour toutes les tâches non cochées
      const tachesNonCochees = taches.filter(t => !t.done);
      for (const tache of tachesNonCochees) {
        await updateTodo(tache.id, true, token);
      }
      
      const nouvellesTaches = taches.map(tache => ({ ...tache, done: true }));
      setTaches(nouvellesTaches);
      setListeAafficher(nouvellesTaches);
      showAlert('Succès', 'Toutes les tâches ont été cochées');
    } catch (err) {
      console.error("Erreur cocher tout:", err);
      showAlert('Erreur', 'Impossible de cocher toutes les tâches');
    }
  };

  const decocherTout = async () => {
    try {
      // Mettre à jour toutes les tâches cochées
      const tachesCochees = taches.filter(t => t.done);
      for (const tache of tachesCochees) {
        await updateTodo(tache.id, false, token);
      }
      
      const nouvellesTaches = taches.map(tache => ({ ...tache, done: false }));
      setTaches(nouvellesTaches);
      setListeAafficher(nouvellesTaches);
      showAlert('Succès', 'Toutes les tâches ont été décochées');
    } catch (err) {
      console.error("Erreur décocher tout:", err);
      showAlert('Erreur', 'Impossible de décocher toutes les tâches');
    }
  };

  // Fonction pour render chaque item avec votre composant TodoItem
  const renderTache = ({ item }) => (
    <TodoItem 
      item={item}
      onPressed={handleToggleTask}
      deleteTodo={handleDeleteTask}
    />
  );

  // Calcul des statistiques
  const tachesCompletees = taches.filter(t => t.done).length;
  const totalTaches = taches.length;
  const progress = totalTaches === 0 ? 0 : tachesCompletees / totalTaches;

  if (chargement) {
    return (
      <View style={styles.ecranCentre}>
        <ActivityIndicator size="large" color="#8B5E3C" />
        <Text style={styles.texteChargement}>Chargement des tâches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.conteneur}>
      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progression</Text>
          <Text style={styles.progressText}>
            {tachesCompletees} / {totalTaches} terminées
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.pourcentage}>
          {Math.round(progress * 100)}% complété
        </Text>
      </View>

      {/* Boutons de filtrage */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: "#A18977" }]}
          onPress={() => filter("TOUT")}
        >
          <Text style={styles.filterButtonText}>TOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: "#C2B280" }]}
          onPress={() => filter("EN COURS")}
        >
          <Text style={styles.filterButtonText}>EN COURS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: "#6B4C3B" }]}
          onPress={() => filter("RESOLUS")}
        >
          <Text style={styles.filterButtonText}>RESOLUS</Text>
        </TouchableOpacity>
      </View>

      {/* Boutons de gestion en masse */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#6B4C3B" }]}
          onPress={cocherTout}
        >
          <Text style={styles.actionButtonText}>COCHER TOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#A18977" }]}
          onPress={decocherTout}
        >
          <Text style={styles.actionButtonText}>DÉCOCHER TOUT</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.creation}>
        <TextInput
          style={styles.champTexte}
          placeholder="Nouvelle tâche..."
          placeholderTextColor="#A89B8C"
          value={nouvelleTache}
          onChangeText={setNouvelleTache}
          onSubmitEditing={ajouterTache}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.boutonAjouter, creationEnCours && styles.boutonDesactive]}
          onPress={ajouterTache}
          disabled={creationEnCours || !nouvelleTache.trim()}
        >
          <Text style={styles.texteBoutonAjouter}>
            {creationEnCours ? '...' : 'Ajouter'}
          </Text>
        </TouchableOpacity>
      </View>

 <FlatList
  data={listeAafficher}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.itemContainer}> 
      <TodoItem 
        item={item}
        onPressed={handleToggleTask}
        deleteTodo={handleDeleteTask}
      />
    </View>
  )}
  ListEmptyComponent={
    <View style={styles.vide}>
      <Text style={styles.texteVide}>Aucune tâche dans cette liste</Text>
      <Text style={styles.sousTexteVide}>
        Ajoutez votre première tâche ci-dessus !
      </Text>
    </View>
  }
  style={styles.liste}
  contentContainerStyle={listeAafficher.length === 0 && styles.listeVide}
  showsVerticalScrollIndicator={false}
/>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: '#F5F0E6',
    paddingHorizontal: 16,
  },
   itemContainer: {
    marginVertical: 4, 
  },
  ecranCentre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E6',
  },
  texteChargement: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B5E4A',
  },
  progressContainer: {
    backgroundColor: '#FFF9F0',
    padding: 16,
    borderRadius: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B3B2A',
  },
  progressText: {
    fontSize: 14,
    color: '#6B5E4A',
  },
  progressBarBackground: {
    height: 10,
    width: "100%",
    backgroundColor: "#DDD2C1",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6B4C3B",
  },
  pourcentage: {
    fontSize: 12,
    color: '#8B5E3C',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  filterButtonText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 12 
  },
  actionButtonText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 12 
  },
  creation: {
    flexDirection: 'row',
    backgroundColor: '#FFF9F0',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  champTexte: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD2C1',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#4B3B2A',
  },
  boutonAjouter: {
    backgroundColor: '#8B5E3C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    shadowColor: "#8B5E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  boutonDesactive: {
    backgroundColor: '#C4A484',
  },
  texteBoutonAjouter: {
    color: '#FFF8F0',
    fontSize: 16,
    fontWeight: '600',
  },
  liste: {
    flex: 1,
  },
  listeVide: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  vide: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFF9F0',
    borderRadius: 16,
  },
  texteVide: {
    fontSize: 16,
    color: '#6B5E4A',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  sousTexteVide: {
    fontSize: 14,
    color: '#A89B8C',
    textAlign: 'center',
  },
});