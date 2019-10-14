module.exports = function(sequelize, DataTypes) {
    var businessPG = sequelize.define("businessPG", {
        text: DataTypes.STRING,
        description: DataTypes.TEXT
    });
    return businessPG;
};