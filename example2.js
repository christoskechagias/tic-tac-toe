import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
	Pressable,
	StyleSheet,
	View,
	Alert,
	Text,
	ScrollView,
} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
	const [player1, setPlayer1] = useState({ name: '1', wins: 0 });
	const [player2, setPlayer2] = useState({ name: '2', wins: 0 });

	const [game, setGame] = useState({
		gameState: [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		],
		currentPlayer: 1,
	});

	useEffect(() => {
		initializeGame();
	}, []);

	const initializeGame = () => {
		setGame({
			gameState: [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0],
			],
			currentPlayer: 1,
		});
	};
	const pressBox = (row, col) => {
		if (game.gameState[row][col] !== 0) {
			return;
		}
		let currentPlayer = game.currentPlayer;
		let array = game.gameState.slice();
		array[row][col] = currentPlayer;
		setGame({ gameState: array, currentPlayer: currentPlayer * -1 });

		let winner = getWinner();
		if (winner === 1) {
			Alert.alert('Winner', 'Player 1 is the winner');
			setPlayer1({ ...player1, wins: player1.wins + 1 });
			initializeGame();
		} else if (winner === -1) {
			Alert.alert('Winner', 'Player 2 is the winner');
			setPlayer2({ ...player2, wins: player2.wins + 1 });
			initializeGame();
		}
	};
	const getWinner = () => {
		let array = game.gameState;
		let sum;

		for (let i = 0; i < 3; i++) {
			sum = array[i][0] + array[i][1] + array[i][2];
			if (sum === 3) return 1;
			else if (sum === -3) return -1;
		}

		for (let i = 0; i < 3; i++) {
			sum = array[0][i] + array[1][i] + array[2][i];
			if (sum === 3) return 1;
			else if (sum === -3) return -1;
		}

		sum = array[0][0] + array[1][1] + array[2][2];
		if (sum === 3) return 1;
		else if (sum === -3) return -1;

		sum = array[2][0] + array[1][1] + array[0][2];
		if (sum === 3) return 1;
		else if (sum === -3) return -1;

		return 0;
	};

	const renderIcon = (row, col) => {
		let value = game.gameState[row][col];
		switch (value) {
			case 1:
				return (
					<Icon
						size={80}
						name="close"
						type="material-community"
						color="white"
					/>
				);
			case -1:
				return (
					<Icon
						size={65}
						name="checkbox-blank-circle-outline"
						type="material-community"
						color="white"
					/>
				);
			default:
				return <View />;
		}
	};
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View style={styles.players}>
						<View style={styles.player}>
							<Input
								textAlign="center"
								style={{ color: 'white' }}
								maxLength={10}
								value={player1.name}
								onChangeText={(text) => setPlayer1({ ...player1, name: text })}
							/>
							<Text style={styles.wins}>{player1.wins}</Text>
						</View>
						<View style={styles.player}>
							<Input
								textAlign="center"
								maxLength={10}
								style={{ color: 'white' }}
								value={player2.name}
								onChangeText={(text) => setPlayer2({ ...player2, name: text })}
							/>
							<Text style={styles.wins}>{player2.wins}</Text>
						</View>
					</View>

					<View
						style={{
							flexDirection: 'row',
						}}
					>
						<Pressable
							onPress={() => pressBox(0, 0)}
							style={[
								styles.box,
								{
									borderLeftWidth: 0,
									borderTopWidth: 0,
								},
							]}
						>
							{renderIcon(0, 0)}
						</Pressable>
						<Pressable
							onPress={() => pressBox(0, 1)}
							style={[styles.box, { borderTopWidth: 0 }]}
						>
							{renderIcon(0, 1)}
						</Pressable>
						<Pressable
							onPress={() => pressBox(0, 2)}
							style={[styles.box, { borderRightWidth: 0, borderTopWidth: 0 }]}
						>
							{renderIcon(0, 2)}
						</Pressable>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<Pressable
							onPress={() => pressBox(1, 0)}
							style={[styles.box, { borderLeftWidth: 0 }]}
						>
							{renderIcon(1, 0)}
						</Pressable>
						<Pressable onPress={() => pressBox(1, 1)} style={styles.box}>
							{renderIcon(1, 1)}
						</Pressable>
						<Pressable
							onPress={() => pressBox(1, 2)}
							style={[styles.box, { borderRightWidth: 0 }]}
						>
							{renderIcon(1, 2)}
						</Pressable>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<Pressable
							onPress={() => pressBox(2, 0)}
							style={[styles.box, { borderLeftWidth: 0, borderBottomWidth: 0 }]}
						>
							{renderIcon(2, 0)}
						</Pressable>
						<Pressable
							onPress={() => pressBox(2, 1)}
							style={[styles.box, { borderBottomWidth: 0 }]}
						>
							{renderIcon(2, 1)}
						</Pressable>
						<Pressable
							onPress={() => pressBox(2, 2)}
							style={[
								styles.box,
								{ borderRightWidth: 0, borderBottomWidth: 0 },
							]}
						>
							{renderIcon(2, 2)}
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	players: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		top: 0,
		marginVertical: 60,
	},
	player: {
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 10,
		backgroundColor: 'rgb(36,36,36)',
		borderRadius: 40,
		width: '40%',
		padding: 20,
	},

	wins: {
		color: 'white',
		borderRadius: 30,
		fontWeight: '600',
		fontSize: 25,
	},
	box: {
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'white',
		borderWidth: 2,
		width: 100,
		height: 100,
	},
});
