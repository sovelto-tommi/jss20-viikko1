const express = require('express')
const router = express.Router()
const uuid = require('uuid/v4');

const people = [
    { id: uuid(), name: 'John Doe', email: 'john.doe@party.org' },
    { id: uuid(), name: 'Jane Doe', email: 'jane@company.fi' },
    { id: uuid(), name: 'Donald Duck', email: 'duckster@acme.com' },
    { id: uuid(), name: 'Mickey Mouse', email: 'mickey@acme.com' }
  ]

router.route('/people')
    .get(function (req, res) {
        res.json(people)
    })
    .post(function(req, res) {
        let uusi = req.body;
        if (!uusi.name || !uusi.email) {
            res.status(400).json({"msg": "missing name and/or email"});
            return;
        }
        const uudenid = uuid()
        uusi.id = uudenid;
        people.push(uusi)
        // location-headerin asetus puuttuu
        res.status(201).json(uusi)
    })

router.route('/people/:id')
    .get(function (req, res) {
      for (let person of people) {
        if (person.id === req.params.id) {
          res.json(person)
          return
        }
      }
      res.status(404)
      res.json({'msg': 'Error, no such person!'})
    })
    .delete(function (req, res) {
      for (let person in people) {
        if (people[person].id === req.params.id) {
          people.splice(person, 1)
          res.json({msg: 'Person removed'})
          return
        }
      }
      res.status(404)
      res.json({'msg': 'Error, no such person!'})
    })
    .put(function(req, res) {
        for (let person in people) {
            if (people[person].id === req.params.id) {
                const muuttunut = req.body;
                // alla ennemminkin PATCH toteutus
                if (muuttunut.name) {
                    people[person].name = muuttunut.name
                }
                if (muuttunut.email) {
                    people[person].email = muuttunut.email
                }
                res.status(204).send()
                return
            }
        }
        res.status(404).send()
    })

module.exports = router