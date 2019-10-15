module.exports = function(sequelize, DataTypes) {
  var businessPG = sequelize.define("businessPG", {
    businessName: DataTypes.STRING,
    locationLat: DataTypes.STRING,
    locationLong: DataTypes.STRING,
    menu: DataTypes.TEXT
  });
  return businessPG;
};
