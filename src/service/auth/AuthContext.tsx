import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { tokenStorage } from "../storage/tokenStorage";

interface AuthContextType {
  token: string | null;
  isLoadingToken: boolean;
  logout: () => Promise<void>;
  setToken: (token: string | null) => Promise<void>;
}
interface AuthProviderProps {
  children: ReactNode;
}

type RootStackParamList = {
  LogoutWebView: undefined;
  LoginWebView: undefined;
  Index: undefined;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoadingToken: true,
  logout: async () => {
    throw new Error("logout must be overridden by provider");
  },
  setToken: async () => {
    throw new Error("setToken must be overridden by provider");
  },
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const setToken = useCallback(async (newToken: string | null) => {
    try {
      console.log("setToken called with:", newToken);

      if (newToken) {
        await tokenStorage.saveToken(newToken);
        setTokenState(newToken);
        console.log("✅ Token saved");
      } else {
        await tokenStorage.removeToken();
        setTokenState(null);
        console.log("🗑 Token cleared");
      }
    } catch (error) {
      console.error("Error setting token:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await tokenStorage.getToken();
        setTokenState(storedToken);
      } catch (error) {
        console.error("Failed to load token", error);
        setTokenState(null);
      } finally {
        setIsLoadingToken(false);
      }
    };
    loadToken();
  }, []);

  const logout = useCallback(async () => {
    try {
      await tokenStorage.removeToken();

      setTokenState(null);

      navigation.navigate("LogoutWebView");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  }, [navigation]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoadingToken,
        logout,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
