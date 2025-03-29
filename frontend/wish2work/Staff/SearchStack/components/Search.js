import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Search = ({ route, navigation }) => {
    const { department_id, department_name } = route.params;
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);  // Store all students for resetting
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [programNames, setProgramNames] = useState({});
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    const fetchProgramName = async (programId) => {
        try {
            const response = await fetch(`https://wish2work.onrender.com/api/programs/${programId}`);
            if (!response.ok) throw new Error('Failed to fetch program');
            const data = await response.json();
            return data.name;
        } catch (err) {
            console.error(`Error fetching program ${programId}:`, err);
            return 'Unknown Program';
        }
    };

    useEffect(() => {
        const fetchStudentsAndPrograms = async () => {
            try {
                const response = await fetch(`https://wish2work.onrender.com/api/departments/${department_id}/students`);
                if (!response.ok) throw new Error('Failed to fetch students');
                
                const studentData = await response.json();
                if (!Array.isArray(studentData)) throw new Error('Data format is incorrect');

                const uniqueProgramIds = [...new Set(studentData.map(student => student.program_id))];
                const programNamePromises = uniqueProgramIds.map(id => fetchProgramName(id));
                const programNamesResults = await Promise.all(programNamePromises);

                const programMap = {};
                uniqueProgramIds.forEach((id, index) => {
                    programMap[id] = programNamesResults[index];
                });

                setProgramNames(programMap);
                setStudents(studentData);
                setAllStudents(studentData);  // Store all students
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudentsAndPrograms();
    }, [department_id]);

    const formatRating = (rating) => {
        const rounded = Math.round(rating * 10) / 10;
        return `${rounded.toFixed(1)}/5.0`;
    };

    const fetchSearchResults = async (query) => {
        if (query.length === 0) {
            // If the search query is empty, show all students
            setStudents(allStudents);
            setError(null);  // Reset the error when search is empty
            return;
        }

        setLoading(true);
        setError(null);  // Reset error state before new search attempt
        try {
            const response = await fetch(`https://wish2work.onrender.com/api/departments/${department_id}/students/search?query=${query}`);
            if (!response.ok) throw new Error('Failed to fetch students');
            const data = await response.json();
            setStudents(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSearchChange = (text) => {
        setSearchQuery(text); // Update the search query state
        fetchSearchResults(text); // Call the search function immediately without debounce
    };

    const sortByRating = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://wish2work.onrender.com/api/departments/${department_id}/students/search?rating=high`);
            if (!response.ok) throw new Error('Failed to fetch sorted students');
            const sortedStudents = await response.json();
            setStudents(sortedStudents);
            setLoading(false);
            setModalVisible(false); // Close the modal after sorting
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={30}
                    color="#4A90E2"
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                />
                <Text style={styles.title}>{department_name}</Text>
            </View>

            <ScrollView style={styles.scrollContainer}>
                {/* Added Text above the search bar */}
                <Text style={styles.searchInstruction}>
                    Search students by name, course, or skill
                </Text>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search students..."
                            placeholderTextColor="#888"
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                        />
                        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
                        <Icon name="sliders" size={30} color="#2C2F6B" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#1F4287" />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <View>
                        <Text style={styles.resultsCount}>
                            {students.length} {students.length === 1 ? 'result' : 'results'} found
                        </Text>
                        {students.map((item) => (
                            <TouchableOpacity
                                key={item.student_id}
                                style={styles.studentCard}
                                onPress={() => {
                                    const { created_at, updated_at, ...studentData } = item;
                                    navigation.navigate('Profile', {
                                        ...studentData,
                                        programName: programNames[item.program_id] || 'Loading program...',
                                        departmentName: department_name // From route params
                                    });
                                }}
                            >
                                <Image 
                                    source={require('../../../assets/logo.png')}
                                    style={styles.cardLogo}
                                    resizeMode="contain"
                                />
                                <Text style={styles.studentName}>{item.first_name} {item.last_name}</Text>
                                <View style={styles.infoContainer}>
                                    <Text style={styles.studentInfo}>
                                        {programNames[item.program_id] || 'Loading program...'}
                                    </Text>
                                    <View style={styles.ratingContainer}>
                                        <Icon style={{marginRight: 10}} name="star" size={20} color="#FFD700" />
                                        <Text style={styles.studentInfo}>
                                            {formatRating(item.average_rating)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Modal for sorting by rating */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sort Results</Text>
                        <Button title="Sort by Rating (High to Low)" onPress={sortByRating} />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    scrollContainer: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C2F6B',
    },
    searchInstruction: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
        marginTop: 10,
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '85%',
        backgroundColor: '#FFFFFF',
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        height: 50,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        color: '#333',
        fontSize: 18,
    },
    searchIcon: {
        marginLeft: 8,
    },
    filterButton: {
        marginLeft: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    studentCard: {
        backgroundColor: '#2C2F6B',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        position: 'relative',
    },
    cardLogo: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: width * 0.18,
        height: width * 0.1,
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    infoContainer: {
        marginTop: 4,
    },
    studentInfo: {
        color: 'white',
        marginVertical: 6,
        fontSize: 16,
        lineHeight: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultsCount: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Search;
