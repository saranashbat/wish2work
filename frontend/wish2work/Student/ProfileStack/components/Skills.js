import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const Skills = ({ route }) => {
  const { studentId } = route.params; // studentId passed from the previous page
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch skills for the student
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://wish2work.onrender.com/api/students/${studentId}/skills`);
        setSkills(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [studentId]);

  const handleAddSkill = async () => {
    if (!newSkill.title || !newSkill.description) {
      Alert.alert('Error', 'Please fill in both title and description');
      return;
    }

    try {
      const response = await axios.post('https://wish2work.onrender.com/api/skills', {
        student_id: studentId,
        title: newSkill.title,
        description: newSkill.description,
      });

      if (response.status === 201) {
        setSkills(prevSkills => [...prevSkills, response.data]); // Update the skill list
        setNewSkill({ title: '', description: '' }); // Reset form fields
        Alert.alert('Success', 'Skill added successfully');
      } else {
        Alert.alert('Error', 'Failed to add skill');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add skill');
      console.error(error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const response = await axios.delete(`https://wish2work.onrender.com/api/skills/${skillId}`);

      if (response.status === 200) {
        setSkills(skills.filter(skill => skill.skill_id !== skillId));
        Alert.alert('Success', 'Skill deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete skill');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete skill');
      console.error(error);
    }
  };

  const renderSkillCard = (skill) => (
    <View style={styles.card} key={skill.skill_id}>
      <View style={styles.cardHeader}>
        <Text style={styles.skillTitle}>{skill.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteSkill(skill.skill_id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.skillDescription}>{skill.description}</Text>
      <Text style={styles.skillDate}>Added on: {new Date(skill.date_added).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add your skills or certificates here</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Skill Title"
          value={newSkill.title}
          onChangeText={(text) => setNewSkill({ ...newSkill, title: text })}
        />
        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Description"
          value={newSkill.description}
          onChangeText={(text) => setNewSkill({ ...newSkill, description: text })}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddSkill}>
          <Text style={styles.addButtonText}>Add Skill</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading skills...</Text>
      ) : (
        <>
          {skills.length > 0 ? (
            skills.map(renderSkillCard)
          ) : (
            <Text style={styles.noSkillsText}>No skills added yet. Add a new one!</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  skillDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  skillDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  noSkillsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Skills;
