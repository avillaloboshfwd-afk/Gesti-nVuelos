// ============================================
// Modelo de Usuario (User)
// Define la estructura de la tabla 'Users' en la base de datos
// ============================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del usuario'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
    },
    comment: 'Nombre completo del usuario'
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: {
      msg: 'Este correo electrónico ya está registrado'
    },
    validate: {
      isEmail: { msg: 'Debe proporcionar un correo electrónico válido' },
      notEmpty: { msg: 'El correo electrónico no puede estar vacío' }
    },
    comment: 'Correo electrónico del usuario (único)'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña no puede estar vacía' }
    },
    comment: 'Contraseña hasheada con bcrypt'
  },
  role: {
    type: DataTypes.ENUM('admin', 'client'),
    defaultValue: 'client',
    allowNull: false,
    comment: 'Rol del usuario: admin o client'
  }
}, {
  tableName: 'Users',
  timestamps: true,
  hooks: {
    // Hook para hashear la contraseña antes de crear el usuario
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Hook para hashear la contraseña antes de actualizar
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método de instancia para comparar contraseñas
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para retornar datos sin la contraseña
User.prototype.toSafeJSON = function() {
  const { password, ...safeData } = this.toJSON();
  return safeData;
};

module.exports = User;
