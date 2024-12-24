import { DataTypes, Model, type Sequelize } from "sequelize";


class Ludopath extends Model {
	declare Id: string; // Airtable record ID and slack ID
	declare balance: number;
	declare timesWon: number;
	declare timesLost: number;
	declare timestampLastWorked: number;
	declare timestampLastLuigi: number;
}


export async function Models(
	sequelize: Sequelize,
): Promise<{ Ludopath: typeof Ludopath }> {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Cannot connect to the database:", error);
	}

	Ludopath.init(
		{
			Id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			balance: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
            timesWon: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            timesLost: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            timestampLastWorked: {
                type: DataTypes.DATETIME,
                allowNull: true,
            },
            timestampLastLuigi: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
		},
		{
			sequelize,
			modelName: "Ludopath",
			timestamps: true,
		},
	);



	await sequelize.sync();

	return { Ludopath };
}
