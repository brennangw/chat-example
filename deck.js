var Deck = {
	cards: {}; //front is top
	
	shuffle: function(){
		
	}
	
	get_top: function(){
	
	} 

}

var Card = {
	num: "";
	suit: "";	
}

var makeDeck = function (input) {
	
	deck_to_send = new Deck();
	var suits = ["Hearts", "Diamonds", "Spades", "Clubs"];

	for(j = 0; j < 4; j++){
		deck_to_send.cards.push(makeCard("Ace",suits[j]);
		for (i = 1; i < 13; i++){
			deck_to_send.cards.push(makeCard(toString(i),suits[j]));
		}
	}



	return deck_to_send;

}




var makeCard = function(num,suit) {
	var card_to_send = new Card();
	card_to_send.num = num;
	card_to_send.suit = suit;
	return card_to_send;
}

