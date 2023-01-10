const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt')

//create User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password)
    }
};

User.init(
    {
        //table colum definitions go here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                        // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
        hooks: {
              // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData){
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
            },
              // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updateUserData){
                updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
                    return updateUserData;
            }
        },
            // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,

            // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,

            // don't pluralize name of database table
        freezeTableName: true,

            // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,

            // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;