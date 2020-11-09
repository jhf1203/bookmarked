module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("Blog", {
    heading: {
      type: DataTypes.STRING,
      required: true
    },
    blurb: {
      type: DataTypes.TEXT,
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
