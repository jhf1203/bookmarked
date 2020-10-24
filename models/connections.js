module.exports = function (sequelize, DataTypes) {
  const Connection = sequelize.define('Connection', {

    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Connection.removeAttribute('id');

  return Connection;
};
