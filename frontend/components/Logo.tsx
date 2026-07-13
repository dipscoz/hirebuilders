"use client";

import { motion } from "framer-motion";


export default function Logo(){

return(

<motion.div

className="logo"

whileHover={{
scale:1.05
}}

>


<div className="logo-icon">

<div className="roof"></div>

<div className="building">

</div>


</div>



<div className="logo-text">


<h2>
Hire<span>Builders</span>
</h2>


<p>
Travaillez avec des professionnels
</p>


</div>


</motion.div>

)

}