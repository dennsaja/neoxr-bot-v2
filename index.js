client.sendIAMessage(m.chat, [{
	name: 'galaxy_message',
	buttonParamsJson: '{ flow_id: "2045973122464553499", "flow_cta":"Open Survey","mode":"published","flow_action_payload":{
		screen:[
		{
		  "id": "QUESTION_ONE",
		  "title": "Question 1 of 3",
		  "data": {},
		  "layout": {
			"type": "SingleColumnLayout",
			"children": [
			  {
				"type": "Form",
				"name": "form",
				"children": [
				  {
					"type": "TextHeading",
					"text": "You've found the perfect deal, what do you do next?"
				  },
				  {
					"type": "CheckboxGroup",
					"label": "Choose all that apply:",
					"required": true,
					"name": "question1Checkbox",
					"data-source": [
					  {
						"id": "0",
						"title": "Buy it right away"
					  },
					  {
						"id": "1",
						"title": "Check reviews before buying"
					  },
					  {
						"id": "2",
						"title": "Share it with friends + family"
					  },
					  {
						"id": "3",
						"title": "Buy multiple, while its cheap"
					  },
					  {
						"id": "4",
						"title": "None of the above"
					  }
					]
				  },
				  {
					"type": "Footer",
					"label": "Continue",
					"on-click-action": {
					  "name": "navigate",
					  "next": {
						"type": "screen",
						"name": "QUESTION_TWO"
					  },
					  "payload": {
						"question1Checkbox": "nanana"
					  }
					}
				  }
				]
			  }
			]
		  }
		}
	]
	},flow_message_version: "3", flow_token: "unused", flow_action: "navigate"}'

  }], null, { header: 'Info Penting', content: 'Mau uang Rp50.000? Cukup dengan gabung di grup ini, hanya ada 3 pemenang!'})