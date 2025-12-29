from flask import Flask, request, jsonify
from collections import defaultdict
from datetime import datetime

app = Flask(__name__)


rates = defaultdict(lambda: {'buy': 0.0, 'sell': 0.0})
cash_register = defaultdict(float) 
history = []  

#     HELPER
def get(*arg):
    data=request.args
    return [data.get(a) for a in arg if a ]

@app.route("/kassa")
def add_to_kassa():
    currency,amount=get("currency","amount")
    cash_register[currency]+=float(amount)
    return "Successfully added"

@app.route('/change_rate')
def change_rate():
    try:
        currency,rate_type,new_rate = get("currency","type","new_rate")
        
        rates[currency][rate_type] = new_rate
        
        return jsonify({
            "message": f"Successfully updated {rate_type} rate for {currency} to {new_rate}",
            "currency": currency,
            "type": rate_type,
            "new_rate": new_rate
        })
        
    except Exception as e:
        return str(e)

@app.route('/sell')
def sell():
    try:
        currency,amount=get("currency","amount")
        
        
        sell_rate = rates[currency]['sell']
        converted_amount = amount * sell_rate
        
        # Update balances
        cash_register[currency] += amount
        cash_register['SOM'] -= converted_amount  # Assuming base currency is SOM

        profit = 0.0
        
        
        return jsonify({
            "message": f"Successfully sold {amount} {currency}",
            "amount_sold": amount,
            "currency": currency,
            "converted_to_som": converted_amount,
            "profit": profit,
            "remaining_balance": cash_register[currency]
        })
    except Exception as e:
        return str(e)

@app.route('/buy')
def buy():
    """Buys currency - converts from base currency to specified currency"""
    try:
        currency,amount=get("currency","amount") 

        
        # Calculate required SOM amount using buy rate
        buy_rate = rates[currency]['buy']
        required_som = amount * buy_rate
        
        # Check if we have enough SOM balance
        if cash_register['SOM'] < required_som:
            return jsonify({"error": "oshibka"})
        
        # Update balances
        cash_register['SOM'] += required_som
        cash_register[currency] -= amount
        
        # Calculate profit (difference between buy and sell rates)
        sell_rate = rates[currency]['sell']
        profit = amount * (buy_rate - sell_rate)
        
        
        return jsonify({
            "message": f"Successfully bought {amount} {currency}",
            "amount_bought": amount,
            "currency": currency,
            "som_spent": required_som,
            "profit": profit,
            "remaining_som_balance": cash_register['SOM']
        })
        
    except Exception as e:
        return str(e)

@app.route('/profit')
def profit():
    try:
        currency,from_date,to_date=get("currency","from_date","to_date")
        
        historyCOPY = history.copy()
        
        if currency:
            historyCOPY = [i for i in historyCOPY if i['currency'] == currency]
        
        if from_date and to_date:
            from_dt = datetime.strptime(from_date, '%Y-%m-%d')
            to_dt = datetime.strptime(to_date, '%Y-%m-%d')
            
            historyCOPY = [j for j in historyCOPY if from_dt <= datetime.strptime(j['date'], '%Y-%m-%d') <= to_dt]
        
        # Calculate total profit
        total_profit = sum(transaction['profit'] for transaction in historyCOPY)
        
        response = {
            "total_profit": total_profit,
            "transaction_count": len(historyCOPY)
        }
        
        if currency:
            response["currency"] = currency
        if from_date and to_date:
            response["date_range"] = {"from": from_date, "to": to_date}
        
        return jsonify(response)
        
    except Exception as e:
        return str(e)
    

@app.route('/amount')
def amount():
    try:
        currency=get("currency")
        if currency:
            return jsonify({
                "currency": currency,
                "amount": cash_register[currency]
            })
        else:
            amounts = {curr: balance for curr, balance in cash_register.items() if balance > 0}
            return jsonify({
                "amounts": amounts,
                "total_currencies": len(amounts)
            })
        
    except Exception as e:
        return str(e)


@app.route('/')
def home():
    return jsonify({
        'rates': rates,
        'cash_register': cash_register,
        'history': history,
        "endpoints": {
            "/change_rate": "Updates buy/sell rate for currency. Params: currency, type (buy/sell), new_rate",
            "/sell": "Sells currency. Params: currency, amount",
            "/buy": "Buys currency. Params: currency, amount", 
            "/profit": "Returns profit. Optional params: currency, from (YYYY-MM-DD), to (YYYY-MM-DD)",
            "/amount": "Returns amounts. Optional param: currency"
        }
    })

app.run(debug=True)