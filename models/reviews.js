module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    comments: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Review.associate = function (models) {
    Review.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Review.belongsTo(models.Book, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Review;
};
