import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from 'react-native-vector-icons';

// Get window dimensions
const { width, height } = Dimensions.get('window');

const Categories = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://wish2work.onrender.com/api/departments')
            .then(response => {
                const filteredDepartments = response.data.filter(department => department.department_id >= 4 && department.department_id <= 8);
                setDepartments(filteredDepartments);
                console.log(filteredDepartments)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
                setLoading(false);
            });
    }, []);

    const departmentIcons = {
        4: 'computer',
        5: 'business',
        6: 'school',
        7: 'engineering',
        8: 'health-and-safety',
    };

    return (
        <View style={styles.container}>
            

            {loading ? (
                <ActivityIndicator size="large" color="#7A9FD9" />
            ) : (
                <>
                    {/* Logo Image at the top */}
                    <Image source={require('../../../assets/logo.png')} style={styles.logo} />
                    {/* New text above the "Select a College" title */}
                    <Text style={styles.subtitle}>Find the right student for the job.</Text>
                    <Text style={styles.title}>Select a College</Text>
                    {departments.map(department => (
                        <TouchableOpacity key={department.department_id} style={styles.departmentButton}>
                            <MaterialIcons name={departmentIcons[department.department_id]} size={30} color="#130160" style={{ marginRight: 10 }} />
                            <Text style={styles.departmentText} numberOfLines={1} ellipsizeMode="tail">
                                {department.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width * 0.05, // 5% padding based on window width
        paddingVertical: height * 0.05, // 5% padding based on window height
        backgroundColor: '#F2F7FA',
    },
    logo: {
        width: width * 0.6, // 40% of screen width
        height: width * 0.25, // Keep it square
        marginBottom: height * 0.05, // 5% space between logo and title
    },
    subtitle: {
        fontSize: width * 0.05, // 5% of screen width for subtitle font size
        fontWeight: 'normal', // Subtitle style
        marginBottom: height * 0.02, // 2% space below subtitle
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 10, 


    },
    title: {
        fontSize: width * 0.06, // 6% of screen width for title font size
        fontWeight: 'bold',
        marginBottom: height * 0.03, // 3% space below title
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    departmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: width * 0.04, // 4% of screen width for padding
        marginBottom: height * 0.02, // 2% space between buttons
        width: '100%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.5,
        elevation: 3,
    },
    departmentText: {
        fontSize: width * 0.05, // 5% of screen width for text size
        flexShrink: 1, // Ensures text doesn't overflow
    },
});

export default Categories;
