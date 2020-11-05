module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("Blog", {
    type: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING,
      required: true
    },
    body: {
      type: DataTypes.STRING,
      required: true
    }
  });

  Blog.associate = function (models) {
    Blog.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Blog;
};
