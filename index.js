// @ts-check

const { default: z } = require("zod")

console.log('søppelplassen')

console.log('Her er det søppel')
console.log('Her er det mer søppel nå')
console.log('Her er det enda mer søppel nå')
console.log('Her er det enda mer søppel en det var før nå')

const TUT = z.object({
  name: z.string(),
  age: z.number(),
})



const tut = TUT.parse({a: 'Ola', age: 'dfjkd'})

console.log('Søppel er gøy')
console.log('Hahahahah, søppel er livet')
