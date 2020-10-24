module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("Rating", {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Rating.associate = function (models) {
    Rating.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Rating.belongsTo(models.Book, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Rating;
};
