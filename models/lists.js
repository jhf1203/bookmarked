module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define("List", {
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  List.associate = function (models) {
    List.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    List.belongsTo(models.Book, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return List;
};
