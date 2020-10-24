module.exports = function (sequelize, DataTypes) {
  const Connection = sequelize.define('Connection', {
    followerID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followeeID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Connection.associate = function (models) {
    Connection.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Connection;
};
