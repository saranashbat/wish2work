import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  Dimensions,
  ScrollView 
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from 'react-native-vector-icons';

// Get window dimensions
const { width, height } = Dimensions.get('window');

const Categories = ({ navigation }) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch departments when the component mounts
        axios.get('https://wish2work.onrender.com/api/departments')
            .then(response => {
                const filteredDepartments = response.data.filter(department => department.department_id >= 4 && department.department_id <= 8);
                setDepartments(filteredDepartments);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
                setLoading(false);
            });
    }, []);

    // Department icons mapping
    const departmentIcons = {
        4: 'computer',
        5: 'business',
        6: 'school',
        7: 'engineering',
        8: 'monitor-heart',
    };

    return (
        <View style={styles.container}>
            {/* Show loading indicator while data is being fetched */}
            {loading ? (
                <ActivityIndicator size="large" color="#7A9FD9" style={styles.loadingIndicator} />
            ) : (
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo Image at the top */}
                    <Image source={require('../../../assets/logo.png')} style={styles.logo} />
                    
                    {/* New text above the "Select a College" title */}
                    <Text style={styles.subtitle}>Find the right student for the job.</Text>
                    <Text style={styles.title}>Select a College</Text>
                    
                    {/* Department buttons */}
                    {departments.map(department => (
                        <TouchableOpacity 
                            key={department.department_id} 
                            onPress={() => navigation.navigate("Search", { 
                                department_id: department.department_id, 
                                department_name: department.name 
                            })}
                            style={styles.departmentButton}
                        >
                            <MaterialIcons 
                                name={departmentIcons[department.department_id]} 
                                size={30} 
                                color="#130160" 
                                style={{ marginRight: 10 }} 
                            />
                            <Text style={styles.departmentText} numberOfLines={1} ellipsizeMode="tail">
                                {department.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    
                    {/* Add some extra space at the bottom */}
                    <View style={{ height: height * 0.05 }} />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F7FA',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.05,
    },
    logo: {
        width: width * 0.6,
        height: width * 0.25,
        marginBottom: height * 0.05,
    },
    subtitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginBottom: height * 0.02,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.03,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    departmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: width * 0.04,
        marginBottom: height * 0.02,
        width: '100%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.5,
        elevation: 3,
    },
    departmentText: {
        fontSize: width * 0.045,
        flexShrink: 1,
    },
    loadingIndicator: {
        position: "absolute",
        top: height * 0.4,
        alignSelf: 'center',
    }
});

export default Categories;