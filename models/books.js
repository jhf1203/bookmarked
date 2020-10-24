module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Book.associate = function (models) {
    Book.hasMany(models.List, {
      onDelete: 'cascade'
    });
  };

  return Book;
};
