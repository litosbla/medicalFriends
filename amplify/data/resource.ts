import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { CfnInstanceStorageConfig } from "aws-cdk-lib/aws-connect";
import { CodeSigningConfig } from "aws-cdk-lib/aws-lambda";
import { prependListener } from "process";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    }),
  Empleado: a
    .model({
      tipoDocumento: a.enum(["CEDULA_CIUDADANIA", "CEDULA_EXTRANJERIA", "OTRA"]),
      numeroDocumento: a.id().required(),
      nombre: a.string(),
      email: a.email(),
      tipoForm: a.enum(["A","B"]),
      empresaId: a.id(),
      empresa: a.belongsTo("Empresa","empresaId"),
    }).identifier(["numeroDocumento"]),
  Empresa: a
    .model({
      empleados: a.hasMany("Empleado","empresaId"),
      sede: a.hasMany("Sedes","empresaId"),
      nit: a.id().required(),
      nombre: a.string(),
      plan: a.enum(["BASICO","PREMIUM"]),
    }).identifier(["nit"]),
  Sedes: a
    .model({
      citas: a.hasMany("Citas","sedeId"),
      nombre: a.string(),
      direccion: a.string(),
      empresaId: a.id(),
      empresa: a.belongsTo("Empresa","empresaId"),
      idsedes: a.id().required(),
    }).identifier(["idsedes"]),
  Citas: a
    .model({
      fecha: a.date(),
      estado: a.enum(["ACTIVA","DESACTIVADA"]),
      otp: a.id().required(),
      sedeId: a.id(),
      sede: a.belongsTo("Sedes","sedeId"),
      contadorFormularios: a.float().default(0),
      contadorCitas: a.float().default(0),
      formulario: a.hasMany("Formulario","citaId")
    }).identifier(["otp"]),
  FormularioPersonales: a
    .model({
      citaId: a.id().required(),
      cita: a.belongsTo("Citas","citaId"),
      documento: a.id().required(),
      empleado: a.belongsTo("Empleado","documento"),
      formularioId: a.id().required(),
      sexo: a.enum(["Masculino", "Femenino"]),
      anoNacimiento: a.string(),
      estadoCivil: a.enum([
        "Soltero",
        "Casado",
        "Ul",
        "Separado",
        "Divorciado",
        "Viudo",
        "Credo"
      ]),
      nivelEstudios: a.enum([
        "Ninguno",
        "Primaria_incompleta",
        "Primaria_completa", 
        "Bachillerato_incompleto",
        "Bachillerato_completo",
        "Tecnico_tecnológico_incompleto",
        "Tecnico_tecnológico_completo",
        "Profesional_incompleto",
        "Profesional_completo",
        "Carrera militar_policía",
        "Post_grado_incompleto",
        "Post_grado_completo"
      ]),
      ocupacion: a.string(),
      lugarResidencia: a.customType({
        ciudad: a.string(),
        departamento: a.string()
      }),
      estrato: a.enum(["1", "2", "3", "4", "5", "6", "Finca", "No_se"]),
      tipoVivienda: a.enum(["Propia", "Arriendo", "Familiar"]),
      personasACargo: a.string(),
      lugarTrabajo: a.customType({
        ciudad: a.string(),
        departamento: a.string()
      }),
      antiguedadEmpresa: a.customType({
        menosDeUnAno: a.boolean(),
        anos: a.string()
      }),
      cargo: a.string(),
      tipoCargo: a.enum([
        "Jefatura",
        "ProfesionalAnalistaTecnicoTecnologo",
        "AuxiliarAsistente",
        "OperarioServiciosGenerales"
      ]),
      antiguedadCargo: a.customType({
        menosDeUnAno: a.boolean(),
        anos: a.string()
      }),
      departamentoEmpresa: a.string(),
      tipoContrato: a.enum([
        "Temporalless1",
        "Temporalmore1",
        "Tindefinido",
        "Cooperado",
        "Ops",
        "Nose"
      ]),
      horasDiarias: a.string(),
      tipoSalario: a.enum([
        "Fijo",
        "Mixto",
        "Variable"
      ])
    }).identifier(["formularioId"]).secondaryIndexes((index) => [index("documento").queryField("listarFormPorDocumento")]),
    FormularioIntralaboralA: a
    .model({
      citaId: a.id().required(),
      cita: a.belongsTo("Citas","citaId"),
      documento: a.id().required(),
      empleado: a.belongsTo("Empleado","documento"),
      formularioId: a.id().required(),
      p1: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p2: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p3: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p4: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p5: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p6: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p7: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p8: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p9: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p10: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p11: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p12: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p13: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p14: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p15: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p16: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p17: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p18: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p19: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p20: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p21: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p22: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p23: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p24: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p25: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p26: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p27: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p28: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p29: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p30: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p31: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p32: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p33: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p34: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p35: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p36: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p37: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p38: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p39: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p40: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p41: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p42: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p43: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p44: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p45: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p46: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p47: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p48: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p49: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p50: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p51: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p52: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p53: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p54: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p55: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p56: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p57: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p58: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p59: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p60: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p61: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p62: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p63: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p64: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p65: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p66: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p67: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p68: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p69: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p70: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p71: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p72: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p73: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p74: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p75: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p76: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p77: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p78: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p79: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p80: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p81: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p82: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p83: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p84: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p85: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p86: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p87: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p88: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p89: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p90: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p91: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p92: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p93: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p94: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p95: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p96: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p97: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p98: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p99: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p100: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p101: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p102: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p103: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p104: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p105: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p106: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p107: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p108: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p109: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p110: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p111: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p112: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p113: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p114: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p115: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p116: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p117: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p118: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p119: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p120: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p121: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p122: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      p123: a.enum(["nunca", "casiNunca", "algunasVeces", "casiSiempre", "siempre"]),
      servicioCliente: a.enum(["si", "no"]),
    }).identifier(["formularioId"]).secondaryIndexes((index) => [index("documento").queryField("listarFormPorDocumento")])
}).authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
