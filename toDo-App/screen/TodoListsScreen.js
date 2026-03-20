import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  FlatList, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { UsernameContext, TokenContext } from '../Context/Context';
import { createTodoList, getTodoLists, deleteTodoList } from '../Api/todoList';
import Todolist from '../components/TodoList';
import ModalConfirmation from '../components/UI/ModalConfirmation';
import CustomAlert from '../components/UI/CustomAlert';

export default function TodoListsScreen({ navigation }) {

  const [username] = useContext(UsernameContext);
  const [token] = useContext(TokenContext);
  
  const [listes, setListes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const [nouvelleListe, setNouvelleListe] = useState('');
  const [creationEnCours, setCreationEnCours] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [listeASupprimer, setListeASupprimer] = useState(null);


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    chargerListes();
  }, []);

  const chargerListes = async () => {
    try {
      setChargement(true);
      const resultat = await getTodoLists(username, token);
      setListes(resultat || []);
    } catch (err) {
      console.error("Erreur :", err);
      setErreur("Impossible de charger les listes");
      showAlert('Erreur', 'Impossible de charger vos listes');
    } finally {
      setChargement(false);
    }
  };

  const creerListe = async () => {
    if (nouvelleListe.trim() === '') {
      showAlert('Attention', 'Donnez un nom à votre liste');
      return;
    }

    try {
      setCreationEnCours(true);
      const listeCreee = await createTodoList(username,nouvelleListe, token);
      setListes([listeCreee, ...listes]);
      setNouvelleListe('');
      showAlert('Succès', `Liste "${nouvelleListe}" créée !`);
    } catch (err) {
      console.error("Erreur création :", err);
      showAlert('Erreur', 'Impossible de créer la liste');
    } finally {
      setCreationEnCours(false);
    }
  };

  const demanderSuppression = (idListe) => {
    console.log("🟡 Demande suppression liste, ID:", idListe);
    setListeASupprimer(idListe);
    setModalVisible(true);
  };

  const supprimerListe = async () => {
    console.log(" Début suppression, ID:", listeASupprimer);
    
    if (!listeASupprimer) {
      console.log(" Aucune liste à supprimer");
      showAlert('Erreur', 'Aucune liste à supprimer');
      return;
    }

    try {
      console.log(" Appel API suppression...");
      await deleteTodoList(listeASupprimer, token);
      
      console.log(" API réussie, mise à jour state");
      setListes(listes.filter(liste => liste.id !== listeASupprimer));
      
      showAlert('Succès', 'Liste supprimée avec succès');
      
    } catch (err) {
      console.error(" Erreur suppression :", err);
      showAlert('Erreur', 'Impossible de supprimer la liste: ' + err.message);
    } finally {
      setModalVisible(false);
      setListeASupprimer(null);
    }
  };
const ouvrirListeTaches = (liste) => {
  console.log("ecran");
  navigation.navigate('TodoItems', {  
    listeId: liste.id, 
    listeTitre: liste.titre || 'Liste sans nom'
  });
};
  // Fonction pour recharger en cas d'erreur
  const handleRecharger = () => {
    setErreur(null);
    chargerListes();
  };

  if (chargement) {
    return (
      <View style={styles.ecranCentre}>
        <ActivityIndicator size="large" color="#8B5E3C" />
        <Text style={styles.texteChargement}>Chargement de vos listes...</Text>
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={styles.ecranCentre}>
        <Text style={styles.texteErreur}>{erreur}</Text>
        <TouchableOpacity style={styles.bouton} onPress={handleRecharger}>
          <Text style={styles.texteBouton}>Réessayer</Text>
        </TouchableOpacity>
        
        {/* Alert pour l'erreur de chargement */}
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.conteneur}>
      <View style={styles.enTete}>
        <Text style={styles.titre}>Mes Listes</Text>
        <Text style={styles.sousTitre}>
          {listes.length} liste{listes.length > 1 ? 's' : ''} au total
        </Text>
      </View>

      <View style={styles.creation}>
        <TextInput
          style={styles.champTexte}
          placeholder="Nom de la nouvelle liste..."
          value={nouvelleListe}
          onChangeText={setNouvelleListe}
          onSubmitEditing={creerListe}
        />
        <TouchableOpacity
          style={[styles.boutonPrincipal, creationEnCours && styles.boutonDesactive]}
          onPress={creerListe}
          disabled={creationEnCours}
        >
          <Text style={styles.texteBoutonPrincipal}>
            {creationEnCours ? 'Création...' : 'Créer'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listes}
        keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => (
      <Todolist 
        todoList={item} 
        onDeleteList={demanderSuppression}
         navigation={navigation} 
      />
  )}
        ListEmptyComponent={
          <View style={styles.vide}>
            <Text style={styles.texteVide}>Aucune liste pour le moment</Text>
            <Text style={styles.sousTexteVide}>
              Créez votre première liste ci-dessus !
            </Text>
          </View>
        }
        style={styles.liste}
      />

      {/* Modal de confirmation pour suppression de liste */}
      <ModalConfirmation
        visible={modalVisible}
        onCancel={() => {
          console.log("Modal annulé");
          setModalVisible(false);
          setListeASupprimer(null);
        }}
        onConfirm={supprimerListe}
        message="Voulez-vous vraiment supprimer cette liste et toutes ses tâches ?"
        confirmText="Supprimer"
        type="danger"
      />

      {/* CustomAlert pour tous les messages */}
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
  // Conteneur principal
  conteneur: {
    flex: 1,
    backgroundColor: '#F5F0E6',
    paddingHorizontal: 16,
  },
  ecranCentre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E6',
    padding: 20,
  },
  texteChargement: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B5E4A',
  },
  texteErreur: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  enTete: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B3B2A',
    marginBottom: 4,
  },
  sousTitre: {
    fontSize: 16,
    color: '#8B5E3C',
  },
  creation: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  champTexte: {
    borderWidth: 1,
    borderColor: '#DDD2C1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  boutonPrincipal: {
    backgroundColor: '#8B5E3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  boutonDesactive: {
    backgroundColor: '#A18977',
    opacity: 0.6,
  },
  texteBoutonPrincipal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bouton: {
    backgroundColor: '#8B5E3C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  texteBouton: {
    color: 'white',
    fontSize: 16,
  },
  liste: {
    flex: 1,
  },
  vide: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  texteVide: {
    fontSize: 18,
    color: '#6B5E4A',
    marginBottom: 8,
    textAlign: 'center',
  },
  sousTexteVide: {
    fontSize: 14,
    color: '#A18977',
    textAlign: 'center',
  },
});