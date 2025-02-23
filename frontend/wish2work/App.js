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
      setLoading(true);

      if (user) {
        try {
          // Fetch the role only after the user is authenticated
          const role = await getUserRole(user.uid);

          if (role) {
            setUserRole(role);
            setIsAuthenticated(true);
            console.log(`User role: ${role}`);
          } else {
            console.log('No role found for user');
            setUserRole(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error fetching role:', error);
          setUserRole(null);
          setIsAuthenticated(false);
        }
      } else {
        // If no user is authenticated, stay on the Auth stack
        setIsAuthenticated(false);
        setUserRole(null);
      }

      setLoading(false);  // Stop loading after auth state and role fetching is complete
    });

    return unsubscribe;  // Clean up the listener on component unmount
  }, []);

  // If still loading, show a loading screen (spinner, etc.)
  if (loading) {
    return <></>;  // You can replace this with a loading spinner if needed
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
          <AuthStack />  // Fallback if an unknown role is returned
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
