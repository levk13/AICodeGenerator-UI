<template>
  <div >
  
   <div id ="quotediv">
          <div id="firstQuote">{{this.bid}}|</div>
           <div id="quote">{{this.ask}}|</div>
           <div id="delta">{{this.delta}}|</div>
           <Button id="delta" v-on:click="getQuote()">Refresh
             <!-- <img src="../assets/sustainable.png" width="16" height="16"/>  -->
            </Button>
            
                <label id="spacing">RT?
                 <input type="checkbox"  v-model="isRealTimeQuotesEnabled"> 
                </label>
            
            </div>
 
  </div>
</template>

<script>
export default {
  name: 'OptionQuote', 
props: {
    symbol: String
  },
data() {
  return {
       bid:0, 
       ask:0, 
       delta:0, 
       isRealTimeQuotesEnabled: true,
       polling: null
  }
},

created() {
     this.getQuote();
      this.pollData();
  },
 beforeDestroy () {
	clearInterval(this.polling)
},

 methods: {
    pollData () {
        this.polling = setInterval(() => {
        this.getQuote();
        }, 10000)
	},

    async getQuote(){
     if(this.isRealTimeQuotesEnabled==false) return;
        const url = "/trading/quote/" + this.symbol;
        const response = await this.$http.get(url);
        this.bid = response.data.bidPrice*100; 
        this.ask = response.data.askPrice*100; 
        this.delta = response.data.delta;
    }

    },


 }
  

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#quote {
  display: inline-block;
  font-weight: bold;
   color:red;
   margin-left:5px

}

#firstQuote {
  display: inline-block;
  font-weight: bold;
   color:green;

}

#delta {
  display: inline-block;
  font-weight: bold;
   color:black;
   margin-left:5px

}

#quotediv {
        float: left;
        width: 180px;
        
      }

firstQuote {
    display: inline-block;
  width: 23%;
  font-weight: bold;
   color:green;
}

</style>
