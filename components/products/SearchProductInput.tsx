import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"

import {SearchIcon} from "lucide-react";

function SearchProductInput() {
    return (
        <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
                <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
                <InputGroupButton type={"submit"}>Search</InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}

export default SearchProductInput;