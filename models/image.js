module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    type: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.BLOB("long")
    }
  });

  Image.associate = function (models) {
    Image.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Image;
};
