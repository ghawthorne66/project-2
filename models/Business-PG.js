module.exports = function(sequelize, DataTypes) {
  var businessPG = sequelize.define("businessPG", {
    businessName: DataTypes.TEXT,
    location: DataTypes.STRING,
    menu: DataTypes.STRING
  });
  return businessPG;
};
