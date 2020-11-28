module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
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
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Book.associate = function (models) {
    Book.hasMany(models.List, {
      onDelete: "cascade"
    });
    Book.hasMany(models.Rating, {
      onDelete: "cascade"
    });
    Book.hasMany(models.Review, {
      onDelete: "cascade"
    });
  };

  return Book;
};
