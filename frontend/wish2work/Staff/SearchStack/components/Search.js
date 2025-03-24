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
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Search = ({ route, navigation }) => {
    const { department_id, department_name } = route.params;
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [programNames, setProgramNames] = useState({});

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
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search students..."
                            placeholderTextColor="#888"
                        />
                        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
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
    errorText: {
        color: 'red',
    },
    resultsCount: {
        fontSize: 16,
        color: '#2C2F6B',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
});

export default Search;