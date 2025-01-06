import type { BoxProps } from '@mui/material/Box';

import {forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    // const gradientId = useId();

    // const TEXT_PRIMARY = theme.vars.palette.text.primary;
    // const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    // const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    /*
    * OR using local (public folder)
    *
    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={`/logo/logo-single.svg`}
        width="100%"
        height="100%"
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={`/logo/logo-full.svg`}
        width="100%"
        height="100%"
      />
    );
    *
    */

    const singleLogo = (
      // <svg
      //   width="100%"
      //   height="100%"
      //   viewBox="0 0 512 512"
      //   fill="none"
      //   xmlns="http://www.w3.org/2000/svg"
      // >
      //   <path
      //     fill={`url(#${`${gradientId}-1`})`}
      //     d="M86.352 246.358C137.511 214.183 161.836 245.017 183.168 285.573C165.515 317.716 153.837 337.331 148.132 344.418C137.373 357.788 125.636 367.911 111.202 373.752C80.856 388.014 43.132 388.681 14 371.048L86.352 246.358Z"
      //   />
      //   <path
      //     fill={`url(#${`${gradientId}-2`})`}
      //     fillRule="evenodd"
      //     clipRule="evenodd"
      //     d="M444.31 229.726C398.04 148.77 350.21 72.498 295.267 184.382C287.751 198.766 282.272 226.719 270 226.719V226.577C257.728 226.577 252.251 198.624 244.735 184.24C189.79 72.356 141.96 148.628 95.689 229.584C92.207 235.69 88.862 241.516 86 246.58C192.038 179.453 183.11 382.247 270 383.858V384C356.891 382.389 347.962 179.595 454 246.72C451.139 241.658 447.794 235.832 444.31 229.726Z"
      //   />
      //   <path
      //     fill={`url(#${`${gradientId}-3`})`}
      //     fillRule="evenodd"
      //     clipRule="evenodd"
      //     d="M450 384C476.509 384 498 362.509 498 336C498 309.491 476.509 288 450 288C423.491 288 402 309.491 402 336C402 362.509 423.491 384 450 384Z"
      //   />
      //   <defs>
      //     <linearGradient
      //       id={`${gradientId}-1`}
      //       x1="152"
      //       y1="167.79"
      //       x2="65.523"
      //       y2="259.624"
      //       gradientUnits="userSpaceOnUse"
      //     >
      //       <stop stopColor={PRIMARY_DARKER} />
      //       <stop offset="1" stopColor={PRIMARY_MAIN} />
      //     </linearGradient>
      //     <linearGradient
      //       id={`${gradientId}-2`}
      //       x1="86"
      //       y1="128"
      //       x2="86"
      //       y2="384"
      //       gradientUnits="userSpaceOnUse"
      //     >
      //       <stop stopColor={PRIMARY_LIGHT} />
      //       <stop offset="1" stopColor={PRIMARY_MAIN} />
      //     </linearGradient>
      //     <linearGradient
      //       id={`${gradientId}-3`}
      //       x1="402"
      //       y1="288"
      //       x2="402"
      //       y2="384"
      //       gradientUnits="userSpaceOnUse"
      //     >
      //       <stop stopColor={PRIMARY_LIGHT} />
      //       <stop offset="1" stopColor={PRIMARY_MAIN} />
      //     </linearGradient>
      //   </defs>
      // </svg>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(0,512) scale(0.1,-0.1)"
          // fill="#5DA16E"
          fill={PRIMARY_DARKER}
          stroke="none"
        >
          <path d="M2075 5042 c153 -52 293 -171 409 -347 73 -110 649 -1182 642 -1194 -3 -5 -70 -44 -149 -86 -78 -42 -145 -80 -149 -83 -4 -4 238 -45 539 -90 300 -46 549 -80 553 -75 6 7 404 872 447 972 l14 33 -110 -58 c-60 -32 -112 -56 -114 -54 -3 3 -78 129 -167 280 -89 151 -183 304 -208 340 -112 159 -264 299 -387 357 l-60 28 -670 2 -670 3 80 -28z" />
          <path d="M1720 4940 c-119 -21 -263 -104 -362 -206 -39 -41 -110 -148 -232 -348 -97 -159 -176 -292 -176 -295 0 -7 957 -595 974 -599 12 -2 526 825 526 847 0 28 -123 250 -183 331 -71 96 -134 152 -222 200 -116 63 -229 88 -325 70z" />
          <path d="M772 3285 c-277 -29 -506 -55 -508 -58 -3 -3 38 -31 91 -62 52 -32 98 -62 101 -66 3 -5 -68 -141 -157 -301 -89 -161 -173 -318 -187 -348 -92 -206 -132 -429 -99 -555 12 -45 96 -196 338 -608 177 -301 323 -546 325 -544 2 2 -2 21 -8 43 -21 69 -15 238 11 329 30 107 70 206 117 287 107 185 660 1088 666 1088 4 0 73 -40 154 -90 81 -49 149 -88 150 -87 2 2 -88 232 -199 512 l-203 510 -44 2 c-25 0 -271 -23 -548 -52z" />
          <path d="M4190 2839 c-267 -155 -489 -285 -494 -289 -5 -5 103 -202 239 -438 l248 -430 86 -8 c166 -13 378 13 486 61 116 51 240 157 283 241 37 73 52 144 52 248 0 111 -25 238 -61 309 -40 78 -341 587 -348 587 -3 0 -224 -127 -491 -281z" />
          <path d="M2860 1399 c-179 -237 -329 -437 -333 -445 -5 -9 96 -151 325 -454 l333 -441 3 124 3 124 212 7 c581 19 745 45 942 149 129 68 110 37 697 1137 l62 115 -60 -53 c-72 -65 -187 -123 -314 -159 l-95 -27 -722 -4 -723 -3 -2 180 -3 180 -325 -430z" />
          <path d="M1064 1422 c-76 -112 -147 -255 -173 -352 -25 -89 -28 -247 -7 -327 37 -139 134 -251 280 -321 151 -74 184 -79 582 -87 l351 -7 7 298 c3 165 9 426 12 580 l7 281 -439 7 c-242 4 -466 9 -499 12 l-61 6 -60 -90z" />
        </g>
      </svg>

    );

    const fullLogo = (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(0,512) scale(0.1,-0.1)"
          fill="#5DA16E"
          stroke="none"
        >
          <path d="M2075 5042 c153 -52 293 -171 409 -347 73 -110 649 -1182 642 -1194 -3 -5 -70 -44 -149 -86 -78 -42 -145 -80 -149 -83 -4 -4 238 -45 539 -90 300 -46 549 -80 553 -75 6 7 404 872 447 972 l14 33 -110 -58 c-60 -32 -112 -56 -114 -54 -3 3 -78 129 -167 280 -89 151 -183 304 -208 340 -112 159 -264 299 -387 357 l-60 28 -670 2 -670 3 80 -28z" />
          <path d="M1720 4940 c-119 -21 -263 -104 -362 -206 -39 -41 -110 -148 -232 -348 -97 -159 -176 -292 -176 -295 0 -7 957 -595 974 -599 12 -2 526 825 526 847 0 28 -123 250 -183 331 -71 96 -134 152 -222 200 -116 63 -229 88 -325 70z" />
          <path d="M772 3285 c-277 -29 -506 -55 -508 -58 -3 -3 38 -31 91 -62 52 -32 98 -62 101 -66 3 -5 -68 -141 -157 -301 -89 -161 -173 -318 -187 -348 -92 -206 -132 -429 -99 -555 12 -45 96 -196 338 -608 177 -301 323 -546 325 -544 2 2 -2 21 -8 43 -21 69 -15 238 11 329 30 107 70 206 117 287 107 185 660 1088 666 1088 4 0 73 -40 154 -90 81 -49 149 -88 150 -87 2 2 -88 232 -199 512 l-203 510 -44 2 c-25 0 -271 -23 -548 -52z" />
          <path d="M4190 2839 c-267 -155 -489 -285 -494 -289 -5 -5 103 -202 239 -438 l248 -430 86 -8 c166 -13 378 13 486 61 116 51 240 157 283 241 37 73 52 144 52 248 0 111 -25 238 -61 309 -40 78 -341 587 -348 587 -3 0 -224 -127 -491 -281z" />
          <path d="M2860 1399 c-179 -237 -329 -437 -333 -445 -5 -9 96 -151 325 -454 l333 -441 3 124 3 124 212 7 c581 19 745 45 942 149 129 68 110 37 697 1137 l62 115 -60 -53 c-72 -65 -187 -123 -314 -159 l-95 -27 -722 -4 -723 -3 -2 180 -3 180 -325 -430z" />
          <path d="M1064 1422 c-76 -112 -147 -255 -173 -352 -25 -89 -28 -247 -7 -327 37 -139 134 -251 280 -321 151 -74 184 -79 582 -87 l351 -7 7 298 c3 165 9 426 12 580 l7 281 -439 7 c-242 4 -466 9 -499 12 l-61 6 -60 -90z" />
        </g>
      </svg>
    );

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
