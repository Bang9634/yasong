package com.bang9634.yasongmuseum.exhibition.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import com.bang9634.yasongmuseum.exhibition.entity.ExhibitionType;

import tools.jackson.databind.json.JsonMapper;

class ExhibitionTypeJsonTest {
    private final JsonMapper mapper = JsonMapper.builder().findAndAddModules().build();

    @ParameterizedTest
    @EnumSource(ExhibitionType.class)
    void existingAndGeneralTypesRoundTripThroughRequestAndResponseJson(ExhibitionType type) {
        String json = """
            {"title":"전시","location":"장소","description":"설명","type":"%s",
             "startDate":"2030-01-01T00:00:00","endDate":"2030-01-10T23:59:59"}
            """.formatted(type.name());

        var create = mapper.readValue(json, CreateExhibitionRequest.class);
        var update = mapper.readValue(json, UpdateExhibitionRequest.class);
        assertEquals(type, create.getType());
        assertEquals(type, update.getType());

        var response = ExhibitionResponse.builder().type(type).build();
        var roundTrip = mapper.readValue(mapper.writeValueAsString(response), ExhibitionResponse.class);
        assertEquals(type, roundTrip.getType());
    }
}
