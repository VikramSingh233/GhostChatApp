"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DeletedNumbers = () => {
    const [deletedNumbers, setDeletedNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    
}