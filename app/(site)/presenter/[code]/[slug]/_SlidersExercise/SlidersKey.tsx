"use client"

import React from "react"
import { Text } from "@/components/Text"


export const SlidersKey = () => {
	
	const [color, setColor] = React.useState("#fecb2f")

	return (
        <div className="inline-block rounded-2xl bg-black px-5 py-4 mb-8 text-white">
            <div className="mb-2 flex items-center">
                <span
                    className="block h-6 w-6"
                    style={{
                        backgroundColor: color,
                    }}
                />
                <Text className="ml-1 uppercase text-24 font-heading capsize">
                    <span style={{
                        color: color,
                    }}>
                        Today
                    </span>
                </Text>
            </div>

            <div className="flex items-center">
                <span
                    className="block h-6 w-6 border-2"
                    style={{
                        borderColor: color,
                        backgroundImage: `repeating-linear-gradient(-45deg,${color},${color} 2px,rgba(0,0,0,0) 2px,rgba(0,0,0,0) 8px)`,
                        backgroundSize: "50px 50px",
                    }}
                />
                <Text className="ml-1 uppercase text-24 font-heading capsize">
                    <span style={{
                        color: color,
                    }}>
                        Tomorrow
                    </span>
                </Text>
            </div>
        </div>
	) 
}
