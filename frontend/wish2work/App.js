import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from './config/auth';
import { getUserRole } from './config/roleService';
import AuthStack from './AuthStack/AuthStack';
import StudentTabs from './Student/StudentTabs';
import StaffTabs from './Staff/StaffTabs';
import AdminTabs from './Admin/AdminTabs';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          setUserRole(role);
          setIsAuthenticated(true);
          console.log(role)
        } catch (error) {
          console.error('Error in role-based routing:', error);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return null; // Add a loading spinner or splash screen here
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        userRole === 'student' ? (
          <StudentTabs />
        ) : userRole === 'staff' ? (
          <StaffTabs />
        ) : userRole === 'admin' ? (
          <AdminTabs />
        ) : (
          <AuthStack />  // Fallback in case of an unknown role
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
