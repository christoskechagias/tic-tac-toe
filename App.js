import React, { useState, useEffect } from 'react';
import {
	Pressable,
	StyleSheet,
	View,
	Alert,
	Text,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { Icon, SpeedDial } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
	const [wins, setWins] = useState({ winsX: 0, winsO: 0 });
	const [theme, setTheme] = useState('dark');
	const [disableTable, setDisableTable] = useState(false);
	const [openSpeedDial, setOpenSpeedDial] = useState(false);
	const [game, setGame] = useState({
		gameState: [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		],
		totalChanges: 0,
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
			totalChanges: 0,
			currentPlayer: 1,
		});
	};

	const newGame = () => {
		initializeGame();
		setDisableTable(false);
	};

	const clearHistory = () => {
		setWins({ winsX: 0, winsO: 0 });
		setDisableTable(false);
		initializeGame();
		setOpenSpeedDial(false);
	};

	const changeTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
		setOpenSpeedDial(false);
	};

	const pressBox = (row, col) => {
		if (game.gameState[row][col] !== 0) {
			return;
		}

		let currentPlayer = game.currentPlayer;
		let table = game.gameState.slice();
		table[row][col] = currentPlayer;

		setGame({
			gameState: table,
			currentPlayer: currentPlayer * -1,
			totalChanges: game.totalChanges + 1,
		});

		let winner = getTheWinner();

		if (winner === 1) {
			Alert.alert('Winner', 'X is the winner!');
			setDisableTable(true);
			setWins({ ...wins, winsX: wins.winsX + 1 });
		} else if (winner === -1) {
			Alert.alert('Winner', 'O is the winner!');
			setDisableTable(true);
			setWins({ ...wins, winsO: wins.winsO + 1 });
		} else if (winner === 2) {
			Alert.alert('Draw', "It's a draw!");
			setDisableTable(true);
		}
	};

	//Check if there is a winner
	const getTheWinner = () => {
		let table = game.gameState;
		let sum;

		for (let i = 0; i < 3; i++) {
			sum = table[i][0] + table[i][1] + table[i][2];
			if (sum === 3) return 1;
			else if (sum === -3) return -1;
		}

		for (let i = 0; i < 3; i++) {
			sum = table[0][i] + table[1][i] + table[2][i];
			if (sum === 3) return 1;
			else if (sum === -3) return -1;
		}

		sum = table[0][0] + table[1][1] + table[2][2];
		if (sum === 3) return 1;
		else if (sum === -3) return -1;

		sum = table[2][0] + table[1][1] + table[0][2];
		if (sum === 3) return 1;
		else if (sum === -3) return -1;

		if (game.totalChanges === 8) {
			return 2;
		}
		return 0;
	};

	//When user press inside the box,it put X or O
	const renderIcon = (row, col) => {
		let value = game.gameState[row][col];
		switch (value) {
			case 1:
				return (
					<Icon
						size={80}
						name="close"
						type="material-community"
						color={theme === 'dark' ? 'white' : 'black'}
					/>
				);
			case -1:
				return (
					<Icon
						size={65}
						name="checkbox-blank-circle-outline"
						type="material-community"
						color={theme === 'dark' ? 'white' : 'black'}
					/>
				);
			default:
				return <View />;
		}
	};
	return (
		<SafeAreaView style={styles.container(theme)}>
			<ScrollView contentContainerStyle={styles.scrollView}>
				<View style={styles.players}>
					{/* Player X */}
					<View style={styles.player(theme)}>
						<Icon
							size={60}
							name="close"
							type="material-community"
							color={theme === 'dark' ? 'white' : 'black'}
						/>
						<Text style={styles.wins(theme)}>{wins.winsX}</Text>
					</View>

					{/* Player O */}
					<View style={styles.player(theme)}>
						<Icon
							size={60}
							name="checkbox-blank-circle-outline"
							type="material-community"
							color={theme === 'dark' ? 'white' : 'black'}
						/>
						<Text style={styles.wins(theme)}>{wins.winsO}</Text>
					</View>
				</View>

				{/* Table */}
				{[0, 1, 2].map((row) => {
					return (
						<View key={row} style={{ flexDirection: 'row' }}>
							{[0, 1, 2].map((col) => {
								return (
									<Pressable
										disabled={disableTable}
										key={col}
										onPress={() => pressBox(row, col)}
										style={[
											styles.box(theme),
											/* Remove the lines of the tables that are not needed*/
											row === 0
												? col === 0
													? {
															borderLeftWidth: 0,
															borderTopWidth: 0,
													  }
													: col === 1
													? { borderTopWidth: 0 }
													: { borderRightWidth: 0, borderTopWidth: 0 }
												: row === 1
												? col === 0
													? { borderLeftWidth: 0 }
													: col === 2 && { borderRightWidth: 0 }
												: col === 0
												? { borderLeftWidth: 0, borderBottomWidth: 0 }
												: col === 1
												? { borderBottomWidth: 0 }
												: { borderRightWidth: 0, borderBottomWidth: 0 },
										]}
									>
										{renderIcon(row, col)}
									</Pressable>
								);
							})}
						</View>
					);
				})}

				{/* NewGame Button  */}
				<TouchableOpacity onPress={newGame} style={styles.newGameButton(theme)}>
					<Text style={styles.newGameButtonText(theme)}>New Game</Text>
				</TouchableOpacity>

				{/* SpeedDial(clearHistory, Change Theme) */}
				<SpeedDial
					overlayColor="none"
					isOpen={openSpeedDial}
					iconContainerStyle={styles.iconSpeedDial(theme)}
					icon={{ name: 'edit', color: theme === 'dark' ? 'white' : 'black' }}
					openIcon={{
						name: 'close',
						color: theme === 'dark' ? 'white' : 'black',
					}}
					onOpen={() => setOpenSpeedDial(!openSpeedDial)}
					onClose={() => setOpenSpeedDial(!openSpeedDial)}
				>
					<SpeedDial.Action
						titleStyle={styles.titleSpeedDial(theme)}
						iconContainerStyle={styles.iconSpeedDialAction(theme)}
						icon={{
							name: 'theme-light-dark',
							color: theme === 'dark' ? 'white' : 'black',
							type: 'material-community',
						}}
						title={theme === 'dark' ? 'Light' : 'Dark'}
						onPress={changeTheme}
					/>
					<SpeedDial.Action
						titleStyle={styles.titleSpeedDial(theme)}
						iconContainerStyle={styles.iconSpeedDialAction(theme)}
						icon={{
							name: 'delete',
							color: theme === 'dark' ? 'white' : 'black',
						}}
						title="Clear History"
						onPress={clearHistory}
					/>
				</SpeedDial>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: (theme) => ({
		flex: 1,
		backgroundColor: theme === 'dark' ? 'black' : 'white',
	}),
	scrollView: {
		alignItems: 'center',
		flex: 1,
	},
	players: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative',
		top: 0,
		marginTop: 20,
		marginBottom: 80,
	},
	player: (theme) => ({
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 10,
		borderRadius: 30,
		width: '40%',
		height: 130,
		padding: 20,
		backgroundColor: theme === 'dark' ? 'rgb(36,36,36)' : 'lightgray',
	}),

	wins: (theme) => ({
		borderRadius: 30,
		fontWeight: '600',
		fontSize: 25,
		marginTop: 20,
		color: theme === 'dark' ? 'white' : 'black',
	}),
	box: (theme) => ({
		justifyContent: 'center',
		alignItems: 'center',
		width: 100,
		height: 100,
		borderColor: theme === 'dark' ? 'white' : 'lightgray',
		borderWidth: 2,
	}),
	newGameButton: (theme) => ({
		backgroundColor: theme === 'dark' ? 'rgb(36,36,36)' : 'lightgray',
		padding: 15,
		borderRadius: 30,
		position: 'absolute',
		bottom: 15,
		right: 90,
	}),
	newGameButtonText: (theme) => ({
		color: theme === 'dark' ? 'white' : 'black',
		fontSize: 20,
	}),
	titleSpeedDial: (theme) => ({
		fontSize: 18,
		fontWeight: '600',
		color: theme === 'dark' ? 'white' : 'black',
		backgroundColor: theme === 'dark' ? 'rgb(36,36,36)' : 'lightgray',
		borderRadius: 30,
	}),
	iconSpeedDial: (theme) => ({
		backgroundColor: theme === 'dark' ? 'rgb(36,36,36)' : 'lightgray',
	}),
	iconSpeedDialAction: (theme) => ({
		backgroundColor: theme === 'dark' ? 'rgb(36,36,36)' : 'lightgray',
	}),
});
