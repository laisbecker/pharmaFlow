import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RouteProp, useRoute } from '@react-navigation/native';

interface Location {
    nome: string;
    latitude: number;
    longitude: number;
}

interface RouteParams {
    origem: Location;
    destino: Location;
}

export default function Mapa() {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { origem, destino } = route.params;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: (origem.latitude + destino.latitude) / 2,
                        longitude: (origem.longitude + destino.longitude) / 2,
                        latitudeDelta: Math.abs(origem.latitude - destino.latitude) * 2,
                        longitudeDelta: Math.abs(origem.longitude - destino.longitude) * 2,
                    }}
                >
                    <Marker coordinate={{ latitude: origem.latitude, longitude: origem.longitude }} title={origem.nome} />
                    <Marker coordinate={{ latitude: destino.latitude, longitude: destino.longitude }} title={destino.nome} />
                    <Polyline
                        coordinates={[
                            { latitude: origem.latitude, longitude: origem.longitude },
                            { latitude: destino.latitude, longitude: destino.longitude },
                        ]}
                        strokeColor="#000"
                        strokeWidth={3}
                    />
                </MapView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
