module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'recipients',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        uniqueKeys: {
          recipient_unique: {
            fields: ['name'],
          },
        },
      }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('recipients');
  },
};
