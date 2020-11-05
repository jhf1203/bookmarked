module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("Blog", {
    type: {
      type: DataTypes.STRING
    },
    heading: {
      type: DataTypes.STRING,
      required: true
    },
    blurb: {
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
