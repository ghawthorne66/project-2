module.exports = function(sequelize, DataTypes) {
  var BusinessPG = sequelize.define("BusinessPG", {
    text: DataTypes.STRING,
    city: DataTypes.STRING,
    lat: DataTypes.DECIMAL(10, 4),
    lng: DataTypes.DECIMAL(10, 4),
    description: DataTypes.TEXT
  });
  return BusinessPG;
};
