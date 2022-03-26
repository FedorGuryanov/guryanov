import * as React from 'react'
import {FC, memo} from 'react'
import './BottomPromo.scss'
import {ExternalLinkIcon} from '@chakra-ui/icons';
import {Link} from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.css';

export const BottomPromo: FC = memo(
    () => {
        return <div className="BottomPromo__wrapper">
            <div className="BottomPromo__ask">
                How it works?
            </div>
            <Carousel showArrows={true}>
                <div>
                    <img src="/Step1.jpg"  alt={'Enter formula'}/>
                </div>
                <div>
                    <img src="/Step2.jpg"  alt={'Evaluate companies'}/>
                </div>
                <div>
                    <img src="/Step3.jpg"  alt={'Share the result'}/>
                </div>
            </Carousel>
            <div className="BottomPromo__ask">
                Want to discuss the result?
            </div>
            <div className="BottomPromo__join">
                <Link href="https://www.reddit.com/r/thestocker/"
                      isExternal>Join us on Reddit<ExternalLinkIcon mx="2px"/></Link> 👈
            </div>
            <div className="BottomPromo__ask _top">
                Have a question?
            </div>
            <div className="BottomPromo__join">
                <Link href="https://www.reddit.com/r/thestocker/comments/srlrdz/rthestocker_lounge/"
                      isExternal>Ask here<ExternalLinkIcon mx="2px"/></Link> 💬
            </div>
        </div>
    }
);
