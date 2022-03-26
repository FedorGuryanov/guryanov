import * as React from 'react'
import {FC, memo} from 'react'
import './Footer.scss'
import {Link} from '@chakra-ui/react';

export const Footer: FC = memo(
    () => {

        return <div className="Footer__wrapper">
            <div className="Footer__shadow"/>
            <div className="Footer">
                Disclaimer:<br/>
                <span>
                The stocker is neither a broker, a dealer, or a registered investment adviser, nor operated by either. Under no circumstances does any information posted on thestocker.org represent a recommendation to buy or sell a security. The information on this site is not intended to be and does not constitute as an investment advice or recommendation. The information on this site does not guarantee completeness, accuracy or any other attributes. In no event shall thestocker.org be liable to any subscriber, visitor, guest or any third party for any damages of any kind arising out of the use of any content or other material published or available on thestocker.org, or relating to the use of, or inability to use, thestocker.org or any content, including, without limitation, any investment losses, lost profits or opportunities, special, incidental, indirect, consequential or punitive damages.
                </span>
                <br/><br/>
                Stocks data provided by <Link href="https://www.alphavantage.co" isExternal>Alpha&nbsp;Vantage</Link>
                <br/><br/>
                For partnership write on <Link href="mailto:thestockerorg@gmail.com">thestockerorg@gmail.com</Link>
                <br/><br/>
                Made by
                <br/>
                Fedor Guryanov | <Link href="https://www.producthunt.com/@fedorguryanov" isExternal>Product Hunt</Link> | <Link href="https://twitter.com/guryanoff" isExternal>Twitter</Link> | <Link href="https://www.linkedin.com/in/fedor-guryanov-00aba410a/" isExternal>Linkedin</Link>
                <br/><br/>
                © The stocker, 2022
            </div>
        </div>
    }
);
