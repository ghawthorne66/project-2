module.exports = function(sequelize, DataTypes) {
  var businessPG = sequelize.define("businessPG", {
<<<<<<< HEAD
    businessName: DataTypes.TEXT,
    location: DataTypes.STRING,
    menu: DataTypes.STRING
=======
    text: DataTypes.STRING,
    description: DataTypes.TEXT
>>>>>>> b78e0fe588b83bcb016890bf64865d88bb510dd6
  });
  return businessPG;
};
