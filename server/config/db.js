const mongoose =require('mongoose')

const connectdb=async()=>
{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI
        //    {
        //     // these are options
        //     useNewUrlParser:true,
        //     useUnifiedTopology:true,
        //     } 
        )
        console.log(`Mongodb connected ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(`Error:${error.message}`.cyan.underline);
        process.exit()
    }
}

module.exports = connectdb
