import { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

export const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

    useEffect(() => {
        const handleResize = debounce(() => setIsMobile(window.innerWidth <= breakpoint), 200);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};
